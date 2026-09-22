-- v4.38: actual full hub, lobby/round transitions and opt-in executor queue contracts.
-- Queue code is executed only against an explicitly supplied local hub-source fixture.
local passed, failed = 0, 0
local function near(a,b)
    assert(type(a)=="number" and math.abs(a-b)<1e-5,"expected "..tostring(b)..", got "..tostring(a))
end
local function frames(m,n) for _=1,(n or 60) do m:frame() end end
local function test(name,fn,setup)
    local ok,err=pcall(function()
        local m=createMock()
        if setup then setup(m,m.env) end
        local h=m:load(hubSource); m:advance(0.05)
        fn(m,h,h.S.GroundSpeed,h.S.Move,m.env)
        m:assertClean()
    end)
    if ok then passed+=1; print("PASS "..name)
    else failed+=1; print("FAIL "..name.."\n  "..tostring(err)) end
end
local function native(m,E)
    m.queued={}
    E.queue_on_teleport=function(code) m.queued[#m.queued+1]=code end
end
local function show(h)
    h.main.Visible=true; h.D.hubTab.Visible=true
    return h.S.groundSpeedControls
end
local function destination(source,url)
    local m=createMock(); local E=m.env
    native(m,E); E.game.PlaceId=2; E.game.JobId="match-server"
    m.fixtureFetches=0
    function E.game:HttpGet(requested)
        assert(requested==url,"loader fetched an unexpected URL")
        m.fixtureFetches+=1
        return source
    end
    return m,E
end
local function runQueued(m,code)
    local fn,err=m.env.loadstring(code,"queued-hub-fixture"); assert(fn,err); fn()
end

test("presets are explicit main-panel buttons, with unknown real maximum disclosed",function(m,h,GS,MV,E)
    local b=show(h)
    assert(b.reset.Text:find("Mặc định",1,true) and b.max.Text:find("Cao nhất",1,true))
    assert(b.max.Parent==b.panel and b.teleport.Parent==b.panel)
    assert(b.observed.Text:find("Mặc định",1,true) and b.observed.Text:find("Cao nhất đã thấy",1,true))
    assert(m:find("GroundSpeedWarning").Text:find("không phải tối đa thật",1,true))
    assert(not GS.teleportAuto and not GS.GetTeleportQueue())
end)

test("default follows native sprint changes without writing or turning itself off",function(m,h,GS,MV,E)
    assert(GS.Set(true)); assert(GS.mode=="game")
    for _,speed in ipairs({24,32,16,20,16}) do
        local writes=m.humanoidWrites.WalkSpeed or 0
        MV.Hum().WalkSpeed=speed; frames(m,20)
        assert(GS.on and not GS.pending and GS.mode=="game")
        near(GS.defaultSpeed,speed); near(GS.value,speed)
        assert(m.humanoidWrites.WalkSpeed==writes+1,"default mode fought a native speed change")
    end
    near(GS.limit,32); near(GS.observedMax,32)
end)

test("known maximum can be selected above default, then reset restores the native baseline",function(m,h,GS,MV,E)
    local b=show(h)
    GS.Set(true); MV.Hum().WalkSpeed=32; MV.Hum().WalkSpeed=16
    b.max.Activated:Fire()
    assert(GS.mode=="max" and GS.on); near(GS.value,32); near(MV.Hum().WalkSpeed,32)
    near(GS.defaultSpeed,16); near(GS.limit,32)
    b.reset.Activated:Fire(); near(MV.Hum().WalkSpeed,16)
    assert(GS.mode=="game" and GS.requested==nil and GS.on)
end)

test("maximum selection while off never changes the character until explicitly enabled",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=30; MV.Hum().WalkSpeed=16
    assert(GS.UseMaxSpeed()); near(GS.value,30); near(MV.Hum().WalkSpeed,16)
    assert(not GS.on); GS.Set(true); near(MV.Hum().WalkSpeed,30)
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

test("mouse slider can choose between default and observed maximum",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=32; MV.Hum().WalkSpeed=16
    local b=show(h); GS.Set(true)
    local p=b.slider.AbsolutePosition; local size=b.slider.AbsoluteSize
    local pointer={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.new(p.X+size.X*0.75,p.Y,0)}
    b.slider.InputBegan:Fire(pointer); m.input.InputEnded:Fire(pointer)
    near(GS.value,24); near(MV.Hum().WalkSpeed,24); assert(b.value.Text=="24")
    near(b.fill.Size.X.Scale,0.75); near(GS.defaultSpeed,16)
end)

test("numeric input can go above default but not above the known peak",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=30; MV.Hum().WalkSpeed=16
    local b=show(h); GS.Set(true)
    b.value.Text="24.5"; b.apply.Activated:Fire(); near(MV.Hum().WalkSpeed,24.5)
    b.value.Text="9000"; b.apply.Activated:Fire(); near(MV.Hum().WalkSpeed,30)
    near(GS.defaultSpeed,16); near(GS.limit,30)
end)

test("own increases and default restoration cannot inflate the known peak",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=28; MV.Hum().WalkSpeed=16; m.deferPropertySignals=true
    GS.Set(true); GS.UseMaxSpeed(); GS.SetValue(25); GS.UseGameSpeed(); m:advance(0.01)
    near(GS.observedMax,28); near(GS.defaultSpeed,16); near(MV.Hum().WalkSpeed,16)
    assert(GS.on)
end)

test("maximum is still unknown beyond samples; a guess never unlocks 500",function(m,h,GS,MV,E)
    assert(GS.UseMaxSpeed()); near(GS.value,16)
    local ok,v,clamped=GS.SetValue(500); assert(ok and clamped); near(v,16)
    near(GS.observedMax,16)
end)

test("manual correction at a positive speed stops even if the historical maximum is larger",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=40; MV.Hum().WalkSpeed=16
    GS.UseMaxSpeed(); GS.Set(true); near(MV.Hum().WalkSpeed,40)
    MV.Hum().WalkSpeed=12; assert(not GS.on and not GS.pending)
    near(GS.defaultSpeed,12); near(GS.limit,40)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,120)
    near(MV.Hum().WalkSpeed,12); assert(m.humanoidWrites.WalkSpeed==writes)
end)

test("enter at lobby speed zero: Bật queues intent, no write until game unlocks",function(m,h,GS,MV,E)
    local b=show(h); local writes=m.humanoidWrites.WalkSpeed or 0
    b.on.Activated:Fire()
    assert(GS.on and GS.pending and b.on.Text:find("Chờ",1,true))
    assert(b.status.Text:find("WalkSpeed = 0",1,true))
    frames(m,120); assert((m.humanoidWrites.WalkSpeed or 0)==writes)
    MV.Hum().WalkSpeed=20; frames(m,60)
    assert(GS.on and not GS.pending); near(GS.value,20); near(GS.defaultSpeed,20); near(GS.limit,20)
end,function(m) m.player.Character.Humanoid.WalkSpeed=0 end)

test("late numeric apply while lobby is locked cannot replace a previous choice with zero",function(m,h,GS,MV,E)
    GS.SetValue(10); GS.Set(true); MV.Hum().WalkSpeed=0
    assert(GS.on and GS.pending and not GS.SetValue(100))
    near(GS.requested,10); near(MV.Hum().WalkSpeed,0)
    MV.Hum().WalkSpeed=24; frames(m,60)
    near(MV.Hum().WalkSpeed,10); near(GS.defaultSpeed,24); assert(not GS.pending)
end)

test("default may be selected while waiting; maximum is unavailable, not guessed",function(m,h,GS,MV,E)
    GS.SetValue(10); GS.Set(true); MV.Hum().WalkSpeed=0
    local b=show(h); b.reset.Activated:Fire()
    assert(GS.mode=="game" and GS.requested==nil and GS.pending)
    assert(not GS.UseMaxSpeed())
    MV.Hum().WalkSpeed=22; frames(m,60); near(MV.Hum().WalkSpeed,22)
end)

test("second toggle and StopAll cancel pending intent without reviving it later",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=0; local b=show(h)
    b.on.Activated:Fire(); assert(GS.on and GS.pending)
    b.on.Activated:Fire(); assert(not GS.on and not GS.pending)
    b.on.Activated:Fire(); MV.StopAll(); assert(not GS.on and not GS.pending)
    MV.Hum().WalkSpeed=24; frames(m,60); assert(not GS.on); near(MV.Hum().WalkSpeed,24)
end)

test("game loading at boot keeps intent without changing Humanoid until loaded",function(m,h,GS,MV,E)
    assert(GS.Set(true) and GS.pending); assert(GS.limit==nil)
    local writes=m.humanoidWrites.WalkSpeed or 0; frames(m,60)
    assert((m.humanoidWrites.WalkSpeed or 0)==writes)
    m.gameLoaded=true; MV.Hum().WalkSpeed=26; frames(m,60)
    assert(GS.on and not GS.pending); near(GS.limit,26); near(GS.defaultSpeed,26)
end,function(m) m.gameLoaded=false end)

test("boot without Character does not require clicking Bật again after a spawn",function(m,h,GS,MV,E)
    assert(GS.Set(true) and GS.pending)
    local char,root,hum=m:character(); hum.WalkSpeed=22; frames(m,60)
    assert(GS.on and not GS.pending); near(GS.defaultSpeed,22); near(GS.value,22)
end,function(m) m.player.Character=nil end)

test("anchored lobby keeps default unknown and never unanchors the character",function(m,h,GS,MV,E)
    assert(GS.Set(true) and GS.pending and GS.limit==nil)
    local root=MV.Root(); local cf=root.CFrame
    frames(m,60); assert(root.Anchored and root.CFrame==cf); near(MV.Hum().WalkSpeed,16)
    root.Anchored=false; MV.Hum().WalkSpeed=24; frames(m,60)
    assert(not GS.pending and GS.on); near(GS.defaultSpeed,24); near(GS.limit,24)
end,function(m) m.player.Character.HumanoidRootPart.Anchored=true end)

test("an active override is restored once when the game anchors the root",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); MV.Root().Anchored=true; frames(m,15)
    assert(GS.on and GS.pending); near(MV.Hum().WalkSpeed,16)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,120)
    assert(m.humanoidWrites.WalkSpeed==writes and MV.Root().Anchored)
    MV.Root().Anchored=false; MV.Hum().WalkSpeed=30; frames(m,60)
    assert(not GS.pending); near(GS.defaultSpeed,30); near(MV.Hum().WalkSpeed,8)
end)

test("root assembled after Humanoid cannot cause a premature application",function(m,h,GS,MV,E)
    local hum=MV.Hum(); GS.Set(true); assert(GS.pending)
    local writes=m.humanoidWrites.WalkSpeed or 0; frames(m,60)
    assert((m.humanoidWrites.WalkSpeed or 0)==writes)
    local root=m.new("Part",m.player.Character); root.Name="HumanoidRootPart"
    hum.RootPart=root; hum.WalkSpeed=18; frames(m,60)
    assert(GS.on and not GS.pending); near(GS.defaultSpeed,18)
end,function(m) m.player.Character.HumanoidRootPart:Destroy() end)

test("Humanoid.RootPart supports a nonstandard root name without changing old flight helpers",function(m,h,GS,MV,E)
    assert(MV.Root()==nil and GS._root==MV.Hum().RootPart)
    GS.SetValue(8); assert(GS.Set(true) and not GS.pending); near(MV.Hum().WalkSpeed,8)
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end,function(m) m.player.Character.HumanoidRootPart.Name="TorsoRoot" end)

test("a parked character outside Workspace is not modified until moved into the playing world",function(m,h,GS,MV,E)
    assert(GS.Set(true) and GS.pending and GS.limit==nil)
    local char=m.player.Character; frames(m,60); near(MV.Hum().WalkSpeed,16)
    char.Parent=E.workspace; MV.Hum().WalkSpeed=24; frames(m,60)
    assert(GS.on and not GS.pending); near(GS.limit,24)
end,function(m,E)
    local folder=m.new("Folder",E.game); m.player.Character.Parent=folder
end)

test("lobby-to-round on same Humanoid resets peak rather than carrying a lobby boost",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=100; GS.UseMaxSpeed(); GS.Set(true)
    MV.Hum().WalkSpeed=0; assert(GS.pending and GS.observedMax==nil)
    MV.Hum().WalkSpeed=14; frames(m,60)
    assert(GS.on and not GS.pending and GS.mode=="max")
    near(GS.limit,14); near(GS.observedMax,14); near(MV.Hum().WalkSpeed,14)
end)

test("late round configuration is sampled after settling, not the temporary initial 16",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=32; GS.SetValue(20); GS.Set(true)
    local char,root,hum=m:character() -- early native default is 16
    m:frame(0.1); near(hum.WalkSpeed,16); assert(GS.pending)
    hum.WalkSpeed=24; m:frame(0.1); near(hum.WalkSpeed,24); assert(GS.pending)
    frames(m,60); near(GS.defaultSpeed,24); near(GS.limit,24); near(hum.WalkSpeed,20)
    GS.Set(false); near(hum.WalkSpeed,24)
end)

test("positive native speed changes do not restart the actor-readiness window",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); MV.Hum().WalkSpeed=0
    MV.Hum().WalkSpeed=18; m:frame(0.2)
    MV.Hum().WalkSpeed=22; m:frame(0.2)
    assert(not GS.pending); near(MV.Hum().WalkSpeed,8) -- actor was ready for 0.4s, speed need not stand still
    frames(m,60); assert(not GS.pending); near(GS.defaultSpeed,22); near(MV.Hum().WalkSpeed,8)
end)

test("rapid character replacements do not write to an intermediate lobby dummy",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local c1,r1,h1=m:character(); h1.WalkSpeed=40
    m:frame(0.1)
    local c2,r2,h2=m:character(); h2.WalkSpeed=22
    h1.WalkSpeed=0; frames(m,60)
    assert(GS.on and not GS.pending and GS._hum==h2)
    near(h1.WalkSpeed,0); near(h2.WalkSpeed,8); near(GS.limit,22)
end)

test("root replacement on the same Humanoid rechecks readiness without a competing mover",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); MV.Root():Destroy(); frames(m,15)
    assert(GS.pending); near(MV.Hum().WalkSpeed,16)
    local root=m.new("Part",m.player.Character); root.Name="HumanoidRootPart"
    MV.Hum().RootPart=root; MV.Hum().WalkSpeed=24; frames(m,60)
    assert(not GS.pending and not MV._bv and not MV._wd)
    near(MV.Hum().WalkSpeed,8); near(GS.defaultSpeed,24)
end)

test("temporary GUI reparent during a round transition does not permanently close controls",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); local parent=h.gui.Parent
    h.gui.Parent=nil; frames(m,20)
    assert(not GS._closed and GS.pending); near(MV.Hum().WalkSpeed,16)
    h.gui.Parent=parent; frames(m,60)
    assert(not GS._closed and GS.on and not GS.pending); near(MV.Hum().WalkSpeed,8)
    h.S.groundSpeedControls.stop.Activated:Fire(); assert(not GS.on)
    h.S.groundSpeedControls.on.Activated:Fire(); assert(GS.on)
end)

test("choosing another movement mode while waiting cancels the pending ground request",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=0; GS.Set(true); assert(GS.pending)
    MV.SetFly(true); assert(not GS.on and not GS.pending and MV.fly)
    MV.Hum().WalkSpeed=20; frames(m,60); assert(MV.fly and not GS.on)
end)

test("all ground speed transitions keep only native movement and no virtual buttons",function(m,h,GS,MV,E)
    GS.Set(true); MV.Hum().WalkSpeed=30; MV.Hum().WalkSpeed=16; GS.UseMaxSpeed()
    MV.Hum().WalkSpeed=0; MV.Hum().WalkSpeed=24; frames(m,60)
    assert(GS.on and not GS.pending and not MV.noclip and not MV.infJump and not MV.fly)
    assert(MV.Root().CanCollide and not MV.Hum().PlatformStand and not MV._bv and not MV._bg)
    assert(not MV._wd and not m:find("BC_GroundSpeedHud"))
    near(E.workspace.Gravity,196.2); near(MV.Hum().JumpPower,50)
end)

test("steady resumed frames do not allocate Instances, add observers or rewrite WalkSpeed",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); MV.Hum().WalkSpeed=0; MV.Hum().WalkSpeed=24; frames(m,60)
    local writes=m.humanoidWrites.WalkSpeed; local instances=#m.instances
    local signals=MV.Hum():GetPropertyChangedSignal("WalkSpeed"):Count()
    frames(m,300)
    assert(m.humanoidWrites.WalkSpeed==writes and #m.instances==instances)
    assert(MV.Hum():GetPropertyChangedSignal("WalkSpeed"):Count()==signals)
end)

test("stop during the settling window is final, even after CharacterAdded's delayed callback",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local char,root,hum=m:character(); hum.WalkSpeed=24; m.player.CharacterAdded:Fire(char)
    GS.Set(false); frames(m,90)
    assert(not GS.on and not GS.pending); near(hum.WalkSpeed,24)
end)

test("unsupported executor reports manual reload instead of claiming a queued transfer",function(m,h,GS,MV,E)
    local b=show(h); b.teleport.Activated:Fire()
    assert(not GS.teleportAuto and not GS._queueSent)
    assert(b.teleportStatus.Text:find("không hỗ trợ",1,true))
    m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
    assert(not GS._queueAttempted and #h.S.queued==0)
end)

test("RAM compatibility queue is explicitly excluded from real teleport capability",function(m,h,GS,MV,E)
    h.S.EnsureCompat()
    E.queue_on_teleport=E._G.queue_on_teleport -- simulate an executor exposing _G as globals
    assert(type(E.queue_on_teleport)=="function" and E.queue_on_teleport==E._G.BananaCatHub_QueueShim)
    assert(not GS.GetTeleportQueue() and not GS.SetTeleportAuto(true))
    assert(#h.S.queued==0)
end)

test("compatibility queue remains excluded after reloading the hub",function(m,h,GS,MV,E)
    h.S.EnsureCompat(); E.queue_on_teleport=E._G.queue_on_teleport
    local nextHub=m:load(hubSource); m:advance(0.05)
    assert(not nextHub.S.GroundSpeed.GetTeleportQueue())
    assert(not nextHub.S.GroundSpeed.SetTeleportAuto(true))
end)

for _,alias in ipairs({"queue_on_teleport","queueonteleport","syn","fluxus"}) do
    test("detects real executor queue via "..alias.." without opting in automatically",function(m,h,GS,MV,E)
        assert(GS.GetTeleportQueue() and not GS.teleportAuto)
        m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2); assert(#m.queued==0)
        assert(GS.SetTeleportAuto(true))
        m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
        assert(#m.queued==1 and GS._queueSent)
        assert(loadstring(m.queued[1]))
    end,function(m,E)
        m.queued={}; local q=function(code) m.queued[#m.queued+1]=code end
        if alias=="syn" or alias=="fluxus" then E[alias]={queue_on_teleport=q} else E[alias]=q end
    end)
end

test("opt-in alone never queues code or makes any network request",function(m,h,GS,MV,E)
    assert(GS.SetTeleportAuto(true)); frames(m,120)
    assert(#m.queued==0 and m.httpCalls==0)
    GS.SetTeleportAuto(false)
    m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2); assert(#m.queued==0)
end,native)

test("Started plus repeated InProgress queues once and suspends ground movement",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); GS.SetTeleportAuto(true)
    m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
    m.player.OnTeleport:Fire(E.Enum.TeleportState.InProgress,2)
    m.player.OnTeleport:Fire(E.Enum.TeleportState.InProgress,2)
    assert(#m.queued==1 and GS._queueSent and GS.pending and GS.on)
    near(MV.Hum().WalkSpeed,16)
    assert(GS.Status():find("server",1,true))
end,native)

for _,reject in ipairs({"throw","false"}) do
    test("native queue failure "..reject.." is reported, not a false success or an automatic retry",function(m,h,GS,MV,E)
        GS.SetTeleportAuto(true)
        m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
        m.player.OnTeleport:Fire(E.Enum.TeleportState.InProgress,2)
        assert(not GS._queueSent and GS._teleportError:find("Không gửi",1,true))
        assert(m.queueCalls==1)
    end,function(m,E)
        m.queueCalls=0
        E.queue_on_teleport=function()
            m.queueCalls+=1
            if reject=="throw" then error("fixture queue rejected") end
            return false
        end
    end)
end

test("queue disappearing after opt-in reports a manual-reload fallback",function(m,h,GS,MV,E)
    GS.SetTeleportAuto(true); E.queue_on_teleport=nil
    m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
    assert(not GS._queueSent and GS._teleportError:find("không còn",1,true) and #m.queued==0)
end,native)

for _,via in ipairs({"OnTeleport","TeleportInitFailed"}) do
    test("failed teleport via "..via.." resumes the same server only after settling",function(m,h,GS,MV,E)
        GS.SetValue(8); GS.Set(true); GS.SetTeleportAuto(true)
        m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
        m.player.OnTeleport:Fire(E.Enum.TeleportState.InProgress,2)
        if via=="OnTeleport" then m.player.OnTeleport:Fire(E.Enum.TeleportState.Failed,2)
        else m.teleport.TeleportInitFailed:Fire(m.player) end
        assert(not GS._teleporting and GS.pending and not GS._queueAttempted)
        near(MV.Hum().WalkSpeed,16); frames(m,60)
        assert(GS.on and not GS.pending); near(MV.Hum().WalkSpeed,8)
        m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
        assert(#m.queued==2,"retry was not queued")
    end,native)
end

test("other players' teleport failures do not change our controller",function(m,h,GS,MV,E)
    GS.Set(true); GS.SetTeleportAuto(true)
    m.player.OnTeleport:Fire(E.Enum.TeleportState.InProgress,2)
    local other=m.new("Player",E.game:GetService("Players"))
    m.teleport.TeleportInitFailed:Fire(other)
    assert(GS._teleporting and GS.pending and GS._queueSent)
end,native)

test("disabling an already-sent queue is honest about not being able to recall executor code",function(m,h,GS,MV,E)
    GS.SetTeleportAuto(true); m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
    local on,reason=GS.SetTeleportAuto(false)
    assert(not on and not GS.teleportAuto and reason:find("không thể thu hồi",1,true))
    assert(#m.queued==1)
end,native)

test("reload and GUI close never leak native-teleport or character observers",function(m,h,GS,MV,E)
    local tele=m.player.OnTeleport:Count(); local fail=m.teleport.TeleportInitFailed:Count()
    local chars=m.player:GetPropertyChangedSignal("Character"):Count()
    for i=1,3 do
        GS.SetTeleportAuto(true)
        h=m:load(hubSource); m:advance(0.05); GS=h.S.GroundSpeed
        assert(m.player.OnTeleport:Count()==tele and m.teleport.TeleportInitFailed:Count()==fail)
        assert(m.player:GetPropertyChangedSignal("Character"):Count()==chars and not GS.teleportAuto)
    end
    h.gui:Destroy()
    assert(m.player.OnTeleport:Count()==tele-1 and m.teleport.TeleportInitFailed:Count()==fail-1)
    assert(m.player:GetPropertyChangedSignal("Character"):Count()==chars-1)
end,native)

test("queued loader starts a fresh complete hub in a separate mocked server with speed OFF",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=80; GS.UseMaxSpeed(); GS.Set(true); GS.SetTeleportAuto(true)
    m.player.OnTeleport:Fire(E.Enum.TeleportState.Started,2)
    local nextM,nextE=destination(hubSource,GS.reloadUrl)
    nextM.player.Character.Humanoid.WalkSpeed=22
    runQueued(nextM,m.queued[1]); nextM:advance(0.05)
    local nextGS=nextE._G.BananaCatHub_MV.GroundSpeed
    assert(nextGS and not nextGS.on and not nextGS.pending and nextGS.teleportAuto)
    near(nextGS.defaultSpeed,22); near(nextGS.limit,22); assert(nextGS~=GS)
    assert(nextE._G.BananaCatHubAPI.Version=="4.39")
    assert(nextM.fixtureFetches==1 and nextM:count("HubGroundSpeed_Panel")==1)
    assert(nextM:find("HubFly_Panel") and nextM:find("HubSafe_Panel") and nextM:find("HubMove_Panel"))
    nextGS.Set(true); assert(nextGS.on); near(nextM.player.Character.Humanoid.WalkSpeed,22)
    nextM:assertClean()
end,native)

test("duplicate executor payloads load only one hub, without turning off newly selected speed",function(m,h,GS,MV,E)
    local nextM,nextE=destination(hubSource,GS.reloadUrl); local code=GS.TeleportLoader(2)
    runQueued(nextM,code); local nextGS=nextE._G.BananaCatHub_MV.GroundSpeed
    nextGS.SetValue(8); nextGS.Set(true)
    runQueued(nextM,code); nextM:advance(0.05)
    assert(nextM.fixtureFetches==1 and nextE._G.BananaCatHub_MV.GroundSpeed==nextGS and nextGS.on)
    near(nextM.player.Character.Humanoid.WalkSpeed,8); nextM:assertClean()
end)

test("loader waits for a slow game's loaded state rather than crashing before the hub starts",function(m,h,GS,MV,E)
    local nextM,nextE=destination(hubSource,GS.reloadUrl); nextM.gameLoaded=false
    runQueued(nextM,GS.TeleportLoader(2)); assert(nextM.fixtureFetches==0)
    nextM:advance(0.5); assert(nextM.fixtureFetches==0)
    nextM.gameLoaded=true; nextM:advance(0.2)
    assert(nextM.fixtureFetches==1 and nextE._G.BananaCatHub_MV.GroundSpeed)
    nextM:assertClean()
end)

test("loader waits for LocalPlayer and PlayerGui, without a nil LocalPlayer error",function(m,h,GS,MV,E)
    local nextM,nextE=destination(hubSource,GS.reloadUrl)
    local players=nextE.game:GetService("Players"); players.LocalPlayer=nil
    local pg=nextM.player.PlayerGui; pg.Parent=nil
    runQueued(nextM,GS.TeleportLoader(2)); nextM:advance(0.2); assert(nextM.fixtureFetches==0)
    players.LocalPlayer=nextM.player; nextM:advance(0.2); assert(nextM.fixtureFetches==0)
    pg.Parent=nextM.player; nextM:advance(0.2)
    assert(nextM.fixtureFetches==1); nextM:assertClean()
end)

test("loader timeout exits with a warning and no network fetch",function(m,h,GS,MV,E)
    local nextM,nextE=destination(hubSource,GS.reloadUrl); nextM.gameLoaded=false
    runQueued(nextM,GS.TeleportLoader(2)); nextM:advance(61)
    assert(nextM.fixtureFetches==0 and #nextM.warnings>0 and not nextE._G.BananaCatHub_MV)
    nextM.gameLoaded=true; nextM:advance(1); assert(nextM.fixtureFetches==0)
    nextM:assertClean()
end)

for _,wrong in ipairs({"place","experience"}) do
    test("stale queued loader skips a different "..wrong.." instead of applying old lobby state",function(m,h,GS,MV,E)
        local nextM,nextE=destination(hubSource,GS.reloadUrl)
        if wrong=="place" then nextE.game.PlaceId=3 else nextE.game.GameId=99 end
        runQueued(nextM,GS.TeleportLoader(2)); nextM:advance(0.1)
        assert(nextM.fixtureFetches==0 and not nextE._G.BananaCatHub_MV); nextM:assertClean()
    end)
end

for _,failure in ipairs({"download","compile","runtime"}) do
    test("loader "..failure.." failure clears its busy guard and permits an explicit retry",function(m,h,GS,MV,E)
        local nextM,nextE=destination(hubSource,GS.reloadUrl); local good=nextE.game.HttpGet
        nextE.game.HttpGet=function()
            if failure=="download" then error("fixture download unavailable") end
            return failure=="compile" and "not valid Luau !!!" or "error('fixture startup failure')"
        end
        local code=GS.TeleportLoader(2); runQueued(nextM,code)
        assert(not nextE._G.BananaCatHub_QueuedReloadBusy and not nextE._G.BananaCatHub_QueuedReloadJob)
        assert(#nextM.warnings>0)
        nextE.game.HttpGet=good; runQueued(nextM,code)
        assert(nextM.fixtureFetches==1 and nextE._G.BananaCatHub_MV.GroundSpeed)
        nextM:assertClean()
    end)
end

test("loader remains idempotent when two queue tasks arrive while source retrieval yields",function(m,h,GS,MV,E)
    local nextM,nextE=destination(hubSource,GS.reloadUrl); local get=nextE.game.HttpGet
    nextE.game.HttpGet=function(self,url) nextE.task.wait(0.1); return get(self,url) end
    local code=GS.TeleportLoader(2)
    runQueued(nextM,code); runQueued(nextM,code); nextM:advance(0.5)
    assert(nextM.fixtureFetches==1 and nextM:count("HubGroundSpeed_Panel")==1)
    nextM:assertClean()
end)

test("loader can run again if the previous destination GUI was actually destroyed",function(m,h,GS,MV,E)
    local nextM,nextE=destination(hubSource,GS.reloadUrl); local code=GS.TeleportLoader(2)
    runQueued(nextM,code); local old=nextE._G.BananaCatHub_MV.GroundSpeed
    nextE._G.BananaCatHubAPI.HubGui:Destroy(); runQueued(nextM,code)
    assert(nextM.fixtureFetches==2 and nextM:count("HubGroundSpeed_Panel")==1)
    assert(old._closed and nextE._G.BananaCatHub_MV.GroundSpeed~=old)
    nextM:assertClean()
end)

for _,bad in ipairs({-1,0/0,math.huge,"bad"}) do
    test("loader serialization does not generate invalid code for bad destination "..tostring(bad),function(m,h,GS,MV,E)
        local source=GS.TeleportLoader(bad)
        assert(loadstring(source)); assert(not source:find("local target, universe = nan",1,true))
    end)
end


test("a game's genuine default above 500 is preserved and its observed peak remains selectable",function(m,h,GS,MV,E)
    GS.Set(true); near(MV.Hum().WalkSpeed,1200); near(GS.defaultSpeed,1200)
    MV.Hum().WalkSpeed=1600; MV.Hum().WalkSpeed=1200
    assert(GS.UseMaxSpeed()); near(GS.limit,1600); near(MV.Hum().WalkSpeed,1600)
    GS.UseGameSpeed(); near(MV.Hum().WalkSpeed,1200)
end,function(m) m.player.Character.Humanoid.WalkSpeed=1200 end)

test("Roblox float32 rounding at larger game speeds is not mistaken for a server rejection",function(m,h,GS,MV,E)
    local base=MV.Hum().WalkSpeed
    assert(GS.SetValue(123456.7)); assert(GS.Set(true) and not GS.pending)
    assert(math.abs(MV.Hum().WalkSpeed-123456.7)<0.01)
    frames(m,90); assert(GS.on); near(GS.defaultSpeed,base); near(GS.observedMax,base)
    GS.Set(false); near(MV.Hum().WalkSpeed,base)
end,function(m)
    m.floatWalkSpeed=true; m.player.Character.Humanoid.WalkSpeed=1000000.1
end)

print(string.format("\n%d passed / %d failed — lobby and executor contracts in mocks; no real Roblox/server/anti-cheat verification.",passed,failed))
assert(failed==0,"lobby speed regression tests failed")
