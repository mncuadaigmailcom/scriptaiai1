-- Dynamic WalkSpeed patterns are simulated; these are NOT live Evade integration tests.
local passed,failed=0,0
local function near(a,b)
    assert(type(a)=="number" and math.abs(a-b)<1e-4,"expected "..tostring(b)..", got "..tostring(a))
end
local function frames(m,n) for _=1,(n or 60) do m:frame() end end
local function test(name,fn,setup)
    local ok,err=pcall(function()
        local m=createMock(); if setup then setup(m,m.env) end
        local h=m:load(hubSource); m:advance(0.05)
        fn(m,h,h.S.GroundSpeed,h.S.Move,m.env)
        m:assertClean()
    end)
    if ok then passed+=1; print("PASS "..name)
    else failed+=1; print("FAIL "..name.."\n  "..tostring(err)) end
end
local function show(h) h.main.Visible=true; h.D.hubTab.Visible=true; return h.S.groundSpeedControls end

test("continuous native acceleration after a lobby cannot leave both speed readings blank forever",function(m,h,GS,MV,E)
    GS.Set(true); assert(GS.pending)
    for i=1,120 do MV.Hum().WalkSpeed=16+i/10; m:frame() end
    assert(GS.on and not GS.pending,"still waiting for constant WalkSpeed instead of a ready actor")
    near(GS.defaultSpeed,28); near(GS.observedMax,28)
    assert(h.S.groundSpeedControls.observed.Text:find("28",1,true))
end,function(m) m.player.Character.Humanoid.WalkSpeed=0 end)

test("a readable native speed is displayed during the actor warm-up, before any application",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local char,root,hum=m:character(); hum.WalkSpeed=28
    assert(GS.pending); near(hum.WalkSpeed,28)
    near(GS.defaultSpeed,28); near(GS.observedMax,28)
    frames(m); near(hum.WalkSpeed,8)
end)

test("anchored lobby does not hide a readable WalkSpeed or silently guess a maximum",function(m,h,GS,MV,E)
    near(GS.defaultSpeed,35); assert(GS.limit==nil)
    local b=show(h); assert(b.observed.Text:find("35",1,true))
    assert(GS.observedMax==nil); GS.Set(true); assert(GS.pending and MV.Root().Anchored)
    near(MV.Hum().WalkSpeed,35)
end,function(m) m.player.Character.Humanoid.WalkSpeed=35; m.player.Character.HumanoidRootPart.Anchored=true end)

test("another flight mode does not erase readable native speed after character replacement",function(m,h,GS,MV,E)
    MV.SetFly(true)
    local char,root,hum=m:character(); hum.WalkSpeed=24; frames(m)
    near(GS.defaultSpeed,24); near(GS.observedMax,24)
    assert(MV.fly and not GS.on)
end)

test("a single nested Humanoid in the player's own Character supplies readings and ground control",function(m,h,GS,MV,E)
    near(GS.defaultSpeed,28); near(GS.observedMax,28)
    assert(GS.Hum()==m.nestedHum and MV.Hum()==nil)
    assert(GS.SetValue(10) and GS.Set(true)); near(m.nestedHum.WalkSpeed,10)
    GS.Set(false); near(m.nestedHum.WalkSpeed,28)
end,function(m,E)
    local c=m.player.Character; local hum=c.Humanoid; local root=c.HumanoidRootPart
    local rig=m.new("Model",c); rig.Name="ActiveRig"
    hum.Parent=rig; root.Parent=rig; hum.WalkSpeed=28; m.nestedHum=hum
end)

test("top-of-panel readings are visible before the slider, not buried below its controls",function(m,h,GS,MV,E)
    local b=show(h)
    assert(b.observed.Position.Y.Offset+b.observed.Size.Y.Offset<=b.on.Position.Y.Offset)
    assert(b.observed.Position.Y.Offset<b.slider.Position.Y.Offset)
    assert(b.observed.Text:find("16",1,true) and not b.observed.Text:find("—",1,true))
    for _,key in ipairs({"unlock","ceiling","ceilingApply","diagnostics"}) do assert(b[key].Parent==b.panel) end
end)

test("unavailable actor produces an explanation rather than two unexplained dashes",function(m,h,GS,MV,E)
    local b=show(h)
    assert(b.observed.Text:find("chưa đọc được",1,true) and b.observed.Text:find("chưa có mẫu",1,true))
    assert(b.diagnostics.Text:find("Character",1,true))
    assert(GS.defaultSpeed==nil and GS.observedMax==nil and GS.limit==nil)
end,function(m) m.player.Character=nil end)

test("visible readings are not a promise that a parked actor can be controlled",function(m,h,GS,MV,E)
    near(GS.defaultSpeed,30); GS.Set(true); assert(GS.pending and GS.limit==nil)
    GS.SetAllowAbove(true); assert(GS.allowAbove and not GS.SetValue(200))
    frames(m,90); near(m.player.Character.Humanoid.WalkSpeed,30)
end,function(m,E)
    local folder=m.new("Folder",E.game); m.player.Character.Parent=folder
    m.player.Character.Humanoid.WalkSpeed=30
end)

test("deferred continuously changing WalkSpeed after a new spawn also leaves waiting",function(m,h,GS,MV,E)
    m.deferPropertySignals=true; GS.Set(true); m:character()
    for i=1,120 do MV.Hum().WalkSpeed=20+i/20; m:frame() end
    m:advance(0.02)
    assert(GS.on and not GS.pending); near(GS.defaultSpeed,26); near(GS.observedMax,26)
end)

test("positive jitter while speed is OFF still populates both readings",function(m,h,GS,MV,E)
    m:character()
    for i=1,90 do MV.Hum().WalkSpeed=25+(i%3)/10; m:frame() end
    assert(not GS.on and GS.defaultSpeed and GS.observedMax)
    near(GS.defaultSpeed,25); near(GS.observedMax,25.2)
end)

test("a readiness interruption resets the actor timer even during warm-up",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); MV.Hum().WalkSpeed=0
    MV.Hum().WalkSpeed=20; m:frame(0.2); assert(GS.pending)
    MV.Hum().WalkSpeed=0; MV.Hum().WalkSpeed=22; m:frame(0.2)
    assert(GS.pending); near(MV.Hum().WalkSpeed,22)
    frames(m); assert(not GS.pending); near(MV.Hum().WalkSpeed,8)
end)

test("temporary warm-up readings are not promoted into the new round's limit",function(m,h,GS,MV,E)
    GS.UseMaxSpeed(); GS.Set(true)
    local char,root,hum=m:character(); hum.WalkSpeed=80; m:frame(0.1)
    near(GS.defaultSpeed,80); near(GS.observedMax,80); assert(GS.limit==nil)
    hum.WalkSpeed=12; frames(m)
    near(GS.defaultSpeed,12); near(GS.limit,12); near(GS.observedMax,12); near(hum.WalkSpeed,12)
end)

test("legacy boost reports its saved baseline, never the multiplied value as game maximum",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=24; MV.SetSpeed(true); frames(m,30)
    near(MV.Hum().WalkSpeed,72); near(GS.defaultSpeed,24); near(GS.observedMax,24)
    assert(GS.sourceNote:find("boost",1,true))
    MV.SetSpeed(false); frames(m,30); near(GS.defaultSpeed,24)
end)

test("other-mode observation does not learn a maximum from an unavailable anchored actor",function(m,h,GS,MV,E)
    MV.SetFly(true)
    local char,root,hum=m:character(); root.Anchored=true; hum.WalkSpeed=55
    frames(m,30); near(GS.defaultSpeed,55); assert(GS.observedMax==nil and GS.limit==nil)
end)

test("nested-actor discovery never searches another player's character to invent defaults",function(m,h,GS,MV,E)
    local other=m.new("Player",E.game:GetService("Players")); other.Name="Other"
    local char,root,hum=m:character(other); hum.WalkSpeed=500
    frames(m); assert(GS.defaultSpeed==nil and GS.observedMax==nil)
    assert(GS.Set(true) and GS.pending); near(hum.WalkSpeed,500)
end,function(m) m.player.Character.Humanoid:Destroy() end)

test("multiple unknown nested humanoids are reported instead of selecting a random target",function(m,h,GS,MV,E)
    assert(GS.Hum()==nil and GS.defaultSpeed==nil)
    assert(GS.actorNote:find("Nhiều Humanoid",1,true))
    GS.Set(true); assert(GS.pending)
    near(m.ambiguousA.WalkSpeed,16); near(m.ambiguousB.WalkSpeed,16)
end,function(m,E)
    local c=m.player.Character; c.Humanoid:Destroy()
    local a=m.new("Model",c); local b=m.new("Model",c)
    m.ambiguousA=m.new("Humanoid",a); m.ambiguousB=m.new("Humanoid",b)
end)

test("nested humanoid destruction and replacement detach old ownership and relearn",function(m,h,GS,MV,E)
    local c=m.player.Character; local rig=m.new("Model",c)
    local old=MV.Hum(); old.Parent=rig; frames(m)
    GS.SetValue(8); GS.Set(true); local conn=GS._humConn
    old:Destroy(); local hum=m.new("Humanoid",rig); hum.RootPart=MV.Root(); hum.WalkSpeed=28
    frames(m,90)
    assert(GS.Hum()==hum and not conn.Connected and GS.on and not GS.pending)
    near(GS.defaultSpeed,28); near(hum.WalkSpeed,8)
    GS.Set(false); near(hum.WalkSpeed,28)
end)

test("horizontal motion is labelled as measured motion, never native WalkSpeed or maximum",function(m,h,GS,MV,E)
    MV.Root().AssemblyLinearVelocity=E.Vector3.new(30,9000,40); GS.Sample()
    near(GS.motionSpeed,50); near(GS.defaultSpeed,16); near(GS.observedMax,16)
    assert(h.S.groundSpeedControls.diagnostics.Text:find("Đo ngang: 50",1,true))
    assert(not h.S.groundSpeedControls.observed.Text:find("50",1,true))
end)

test("a moving actor with WalkSpeed zero reports a possible custom controller, without guessing a default",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=0; MV.Root().AssemblyLinearVelocity=E.Vector3.new(40,0,0); GS.Sample()
    near(GS.defaultSpeed,0); near(GS.motionSpeed,40); assert(GS.observedMax==nil)
    assert(GS.Diagnostics():find("bộ điều khiển riêng",1,true))
    GS.SetAllowAbove(true); GS.Set(true); assert(GS.pending and not GS.SetValue(100))
    near(MV.Hum().WalkSpeed,0)
end)

test("nonfinite measured velocity never poisons the finite native cap",function(m,h,GS,MV,E)
    MV.Root().AssemblyLinearVelocity=E.Vector3.new(math.huge,0,0/0); GS.Sample()
    assert(GS.motionSpeed==nil); near(GS.defaultSpeed,16); near(GS.limit,16)
end)

test("over-observed range requires explicit opt-in and never accelerates just by unlocking",function(m,h,GS,MV,E)
    assert(not GS.allowAbove); GS.SetValue(100); near(GS.value,16)
    GS.Set(true); local writes=m.humanoidWrites.WalkSpeed or 0
    h.S.groundSpeedControls.unlock.Activated:Fire()
    assert(GS.allowAbove); near(GS.controlMax,2000); near(GS.limit,16)
    near(GS.value,16); near(MV.Hum().WalkSpeed,16)
    assert((m.humanoidWrites.WalkSpeed or 0)==writes)
end)

test("unlocked number input really requests more than the observed cap without falsifying observations",function(m,h,GS,MV,E)
    local b=show(h); b.unlock.Activated:Fire(); GS.Set(true)
    b.value.Text="125.5"; b.apply.Activated:Fire()
    near(GS.value,125.5); near(MV.Hum().WalkSpeed,125.5)
    near(GS.defaultSpeed,16); near(GS.observedMax,16); near(GS.limit,16); near(GS.controlMax,2000)
    assert(GS.mode=="manual" and GS.on and b.value.Text=="125.5")
end)

test("unlock only expands the slider; the native-highest preset does not jump to the custom ceiling",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=32; MV.Hum().WalkSpeed=16
    GS.SetAllowAbove(true); GS.Set(true); h.S.groundSpeedControls.max.Activated:Fire()
    near(GS.value,32); near(MV.Hum().WalkSpeed,32); near(GS.controlMax,2000)
    h.S.groundSpeedControls.reset.Activated:Fire()
    near(MV.Hum().WalkSpeed,16); assert(GS.mode=="game" and GS.allowAbove)
end)

test("custom ceiling has its own Enter/apply path and is not described as game maximum",function(m,h,GS,MV,E)
    local b=show(h); b.unlock.Activated:Fire()
    b.ceiling:CaptureFocus(); b.ceiling.Text="350"; b.ceiling:ReleaseFocus(true)
    near(GS.customCeiling,350); near(GS.controlMax,350)
    b.ceiling.Text="500"; b.ceilingApply.Activated:Fire(); near(GS.controlMax,500)
    assert(h.D.hubStatus.Text:find("không phải tối đa thật",1,true))
    near(GS.observedMax,16)
end)

test("custom ceiling text is preserved while focused during native speed updates and rebuilds",function(m,h,GS,MV,E)
    local b=show(h); GS.SetAllowAbove(true)
    b.ceiling:CaptureFocus(); b.ceiling.Text="325.5"
    MV.Hum().WalkSpeed=22; frames(m,30); h.S.RebuildHubList()
    assert(b.ceiling.Text=="325.5")
    b.ceiling:ReleaseFocus(true); near(GS.customCeiling,325.5)
end)

test("unlocked mouse slider uses the custom range and restores scrolling on release",function(m,h,GS,MV,E)
    local b=show(h); GS.SetAllowAbove(true); GS.SetCustomCeiling(200); GS.Set(true)
    local pos,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local t={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.new(pos.X+size.X*0.5,pos.Y,0)}
    b.slider.InputBegan:Fire(t); near(GS.value,100); near(MV.Hum().WalkSpeed,100)
    near(b.fill.Size.X.Scale,0.5); assert(not h.D.hubList.ScrollingEnabled)
    m.input.InputEnded:Fire(t); assert(h.D.hubList.ScrollingEnabled)
    near(GS.observedMax,16)
end)

test("unlocked touch slider clamps to its chosen ceiling and ignores an unrelated finger",function(m,h,GS,MV,E)
    local b=show(h); GS.SetAllowAbove(true); GS.SetCustomCeiling(200); GS.Set(true)
    local pos,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(pos.X+size.X*2,pos.Y,0)}
    b.slider.InputBegan:Fire(held); near(GS.value,200)
    local other={UserInputType=E.Enum.UserInputType.Touch,Position=pos}
    m.input.InputChanged:Fire(other); m.input.InputEnded:Fire(other); near(GS.value,200)
    held.Position=pos; m.input.InputChanged:Fire(held); near(GS.value,0)
    m.input.InputEnded:Fire(held); assert(h.D.hubList.ScrollingEnabled)
end)

test("requested custom number remains bounded by the explicitly configured ceiling",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetCustomCeiling(400); GS.Set(true)
    local ok,value,clamped=GS.SetValue(9000); assert(ok and clamped); near(value,400)
    near(MV.Hum().WalkSpeed,400); near(GS.observedMax,16)
end)

for _,value in ipairs({"", "not a number", 0, -1, math.huge, -math.huge, 0/0}) do
    test("invalid custom ceiling is rejected: "..tostring(value),function(m,h,GS,MV,E)
        GS.SetAllowAbove(true); local old=GS.customCeiling
        local ok,err=GS.SetCustomCeiling(value)
        assert(not ok and type(err)=="string"); near(GS.customCeiling,old); near(MV.Hum().WalkSpeed,16)
    end)
end

test("technical custom-range ceiling is finite and separately disclosed, not a learned game speed",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true)
    local ok,value,clamped=GS.SetCustomCeiling(1e20)
    assert(ok and clamped); near(value,1000000); near(GS.observedMax,16)
    near(GS.limit,16); near(GS.controlMax,1000000)
end)

test("a low custom extension never reduces a higher genuine native default",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=2500; GS.SetAllowAbove(true); GS.SetCustomCeiling(100)
    GS.UseGameSpeed(); GS.Set(true)
    near(GS.controlMax,2500); near(GS.value,2500); near(MV.Hum().WalkSpeed,2500)
end)

test("disabling over-range clamps immediately and never resurrects a hidden high request",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    GS.SetAllowAbove(false)
    near(MV.Hum().WalkSpeed,16); near(GS.requested,16); near(GS.value,16); near(GS.controlMax,16)
    GS.SetAllowAbove(true); near(MV.Hum().WalkSpeed,16); near(GS.value,16)
end)

test("locking during a respawn gap discards an unsafe pending request rather than resurrecting it",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    m.player.Character=nil; GS.SetAllowAbove(false)
    assert(GS.requested==nil and GS.mode=="game")
    local char,root,hum=m:character(); hum.WalkSpeed=24; frames(m)
    near(hum.WalkSpeed,24); GS.SetAllowAbove(true); near(hum.WalkSpeed,24)
end)

test("locking during a game speed-zero wait never turns a high request into permanent zero",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    MV.Hum().WalkSpeed=0; GS.SetAllowAbove(false)
    assert(GS.requested==nil and GS.mode=="game")
    MV.Hum().WalkSpeed=24; frames(m); near(MV.Hum().WalkSpeed,24)
end)

test("lowering an active custom ceiling clamps now and removes the old higher request",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    GS.SetCustomCeiling(100); near(MV.Hum().WalkSpeed,100); near(GS.requested,100)
    GS.SetCustomCeiling(300); near(MV.Hum().WalkSpeed,100); near(GS.value,100)
end)

test("deferred own over-range writes do not leak into default or observed maximum",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); m.deferPropertySignals=true
    GS.SetValue(150); GS.Set(true); GS.SetValue(220); m:advance(0.02); frames(m,60)
    near(GS.defaultSpeed,16); near(GS.observedMax,16); near(GS.limit,16)
    near(MV.Hum().WalkSpeed,220); assert(GS.on)
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

test("game correction still wins over a custom over-range request, without a hidden retry loop",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    MV.Hum().WalkSpeed=20; assert(not GS.on and GS.allowAbove)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,180)
    near(MV.Hum().WalkSpeed,20); assert(m.humanoidWrites.WalkSpeed==writes)
    near(GS.defaultSpeed,20); near(GS.observedMax,20)
end)

test("immediate write rejection reports a stopped controller even with over-range enabled",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); m.rejectWalkSpeed=true
    local ok,err=GS.Set(true); assert(not ok and err and not GS.on)
    near(MV.Hum().WalkSpeed,16); local writes=m.humanoidWrites.WalkSpeed
    frames(m,60); assert(m.humanoidWrites.WalkSpeed==writes)
end)

test("over-range never unlocks an anchored or zero-speed lobby, but a later valid round may resume",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(100); GS.Set(true)
    MV.Hum().WalkSpeed=0; MV.Root().Anchored=true; frames(m,30)
    assert(GS.pending and GS.on and not GS.SetValue(300)); near(MV.Hum().WalkSpeed,0)
    MV.Root().Anchored=false; MV.Hum().WalkSpeed=24; frames(m)
    assert(not GS.pending); near(MV.Hum().WalkSpeed,100); near(GS.defaultSpeed,24); near(GS.observedMax,24)
end)

test("over-range changes only WalkSpeed; no flight, collisions, gravity or virtual-HUD changes",function(m,h,GS,MV,E)
    local root,hum=MV.Root(),MV.Hum(); local writes=m.cfWrites
    local cam=E.workspace.CurrentCamera.CFrame; local rootCF=root.CFrame; local count=#m.instances
    GS.SetAllowAbove(true); GS.SetValue(200); m.humanoidWrites={}; GS.Set(true); frames(m,90)
    for key in pairs(m.humanoidWrites) do assert(key=="WalkSpeed",key) end
    assert(m.cfWrites==writes and root.CFrame==rootCF and E.workspace.CurrentCamera.CFrame==cam)
    assert(root.CanCollide and not hum.PlatformStand and hum.AutoRotate)
    near(E.workspace.Gravity,196.2); near(hum.JumpPower,50)
    assert(not MV.fly and not MV.noclip and not MV.infJump and not MV._bv and not MV._wd)
    assert(#m.instances==count and not m:find("BC_GroundSpeedHud"))
end)

test("mode handoff restores the native baseline, not the custom request, before legacy boost",function(m,h,GS,MV,E)
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    MV.SetSpeed(true)
    assert(not GS.on and MV.speed); near(MV._baseWS,16); near(MV.Hum().WalkSpeed,48)
    GS.Set(true); assert(not MV.speed and GS.on); near(MV.Hum().WalkSpeed,150)
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

test("stop-all preserves all cards and placed glass while restoring an over-range override",function(m,h,GS,MV,E)
    MV.PlaceGlass(); GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    MV.StopAll(); near(MV.Hum().WalkSpeed,16); assert(not GS.on)
    assert(#h.tabs==7 and #h.S.ScriptHubList==32 and #MV._placedGlasses==1)
    assert(m:find("HubFly_Panel") and m:find("HubSafe_Panel") and m:find("HubMove_Panel"))
end)

test("reload drops over-range permission, restores speed and does not leak slider listeners",function(m,h,GS,MV,E)
    local changed=m.input.InputChanged:Count(); local ended=m.input.InputEnded:Count()
    GS.SetAllowAbove(true); GS.SetValue(150); GS.Set(true)
    local nextHub=m:load(hubSource); m:advance(0.05)
    assert(not nextHub.S.GroundSpeed.allowAbove and not nextHub.S.GroundSpeed.on)
    near(MV.Hum().WalkSpeed,16)
    assert(m.input.InputChanged:Count()==changed and m.input.InputEnded:Count()==ended)
end)

test("destroying a panel restores the over-range write and cancels its active slider drag",function(m,h,GS,MV,E)
    local b=show(h); GS.SetAllowAbove(true); GS.Set(true)
    local p,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(p.X+size.X*0.5,p.Y,0)}
    b.slider.InputBegan:Fire(held); assert(not h.D.hubList.ScrollingEnabled)
    b.panel:Destroy(); assert(not GS.on and h.D.hubList.ScrollingEnabled)
    near(MV.Hum().WalkSpeed,16); m.input.InputChanged:Fire(held); near(MV.Hum().WalkSpeed,16)
end)

test("closed controller cannot change range or create new observers through stale references",function(m,h,GS,MV,E)
    h.gui:Destroy()
    assert(not GS.SetAllowAbove(true) and not GS.SetCustomCeiling(500))
    assert(GS._closed and GS._humConn==nil and GS._heartbeat==nil)
end)


test("teleport reload URL is versioned so older branch-URL cache entries are not reused",function(m,h,GS,MV,E)
    assert(GS.reloadUrl:find("script.js?v=4.39",1,true))
    assert(GS.TeleportLoader(2):find(GS.reloadUrl,1,true))
end)

print(string.format("\n%d passed / %d failed — simulated dynamic-speed, display and custom-range contracts; no live Evade/server verification.",passed,failed))
assert(failed==0,"dynamic ground speed regression tests failed")
