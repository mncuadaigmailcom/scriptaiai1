local passed, failed = 0, 0
local function near(a,b,eps) assert(math.abs(a-b)<(eps or 1e-5), string.format("expected %.8f, got %.8f",b,a)) end
local function vec(a,b) near(a.X,b.X); near(a.Y,b.Y); near(a.Z,b.Z) end
local function test(name,fn)
    local ok,err=pcall(function()
        local m=createMock()
        local hub=m:load(hubSource)
        m:advance(0.05)
        fn(m,hub,hub.S.Move,m.env)
        m:assertClean()
        assert(hub.S.Move.Flight.lastError==nil,hub.S.Move.Flight.lastError)
    end)
    if ok then passed+=1; print("PASS "..name)
    else failed+=1; print("FAIL "..name.."\n  "..tostring(err)) end
end
local function camera(m,look)
    local E=m.env
    E.workspace.CurrentCamera.CFrame=E.CFrame.lookAt(E.Vector3.new(0,35,10),E.Vector3.new(0,35,10)+look)
end
local function touch(E,x,y) return {UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(x,y,0)} end
local function otherPlayer(m,E)
    local p=m.new("Player",E.game:GetService("Players")); p.Name="OtherTester"; p.UserId=2
    m:character(p,E.Vector3.new(50,30,0))
    return p
end
local function frames(m,n) for _=1,n do m:frame() end end

test("full hub keeps 7 pages, all 31 existing cards and adds ground speed",function(m,h,MV,E)
    assert(#h.tabs==7 and #h.S.ScriptHubList==32)
    local names={}
    for _,tab in ipairs(h.tabs) do names[tab:GetAttribute("BCTabName")]=true end
    for _,name in ipairs({"Code","Code Đã Lưu","Script Hub","Hỗ Trợ","Người Chơi","Tạo Tính Năng","Thiết Lập"}) do
        assert(names[name],"lost page "..name)
    end
    assert(not MV.fly and not MV.Safe.on and not MV.noclip)
end)

test("manual flight panel exposes independent noclip, speed and HUD controls",function(m,h,MV,E)
    local b=h.S.flyBtns
    for _,key in ipairs({"on","noclip","speed","apply","hud","stop"}) do assert(b[key].Parent==b.panel) end
    assert(b.panel.LayoutOrder<0 and b.panel.Parent==h.D.hubList)
    assert(not b.panel:FindFirstChild("SafeAuto",true) and not b.panel:FindFirstChild("SafeShield",true))
    assert(m:find("HubSafe_Panel") and m:find("HubMove_Panel") and m:find("HubGlow_Panel"))
end)

test("no input hovers; no autonomous safe-flight effects are started",function(m,h,MV,E)
    assert(MV.SetFly(true)); frames(m,120)
    vec(MV._bv.Velocity,E.Vector3.zero)
    assert(not MV.Safe.on and MV.Safe.auto and MV.Safe.circle and MV.Safe.avoidPlayers)
    assert(not m.bindings.BC_Safe and not MV.Safe._bv and not MV.Safe._shield)
    assert(MV.Flight.hud.Visible and not MV._hud.Visible)
end)

for _,pitch in ipairs({-60,60,-90,90,0}) do
    test("W follows camera pitch "..pitch.." degrees",function(m,h,MV,E)
        local a=math.rad(pitch)
        local look=E.Vector3.new(0,math.sin(a),-math.cos(a))
        camera(m,look); MV.SetFlySpeed(60); MV.SetFly(true); m.keys.W=true; m:frame()
        vec(MV._bv.Velocity,look*60); near(MV._bv.Velocity.Magnitude,60)
        if pitch==-60 then near(MV._bv.Velocity.Y,-51.961524227); near(MV._bv.Velocity.Z,-30) end
    end)
end

test("yaw plus pitch follows camera, not character facing",function(m,h,MV,E)
    local look=E.Vector3.new(0.5,-math.sqrt(3)/2,0)
    camera(m,look)
    MV.Root().CFrame=E.CFrame.lookAt(MV.Root().Position,MV.Root().Position+E.Vector3.new(-1,0,0))
    MV.SetFly(true); m.keys.W=true; m:frame()
    vec(MV._bv.Velocity,look*MV.flySpeed)
end)

test("turning the camera changes flight direction without replacing movers",function(m,h,MV,E)
    MV.SetFly(true); m.keys.W=true; m:frame(); local bv=MV._bv
    camera(m,E.Vector3.new(1,0,0)); m:frame()
    vec(MV._bv.Velocity,E.Vector3.new(MV.flySpeed,0,0)); assert(MV._bv==bv)
end)

test("S flies backwards along the full pitched camera vector",function(m,h,MV,E)
    local look=E.Vector3.new(0,-math.sqrt(3)/2,-0.5)
    camera(m,look); MV.SetFly(true); m.keys.S=true; m:frame()
    vec(MV._bv.Velocity,-look*MV.flySpeed)
end)

for _,key in ipairs({"A","D"}) do
    test(key.." strafes along camera right axis",function(m,h,MV,E)
        camera(m,E.Vector3.new(0,-math.sqrt(3)/2,-0.5)); MV.SetFly(true)
        m.keys[key]=true; m:frame()
        vec(MV._bv.Velocity,E.workspace.CurrentCamera.CFrame.RightVector*(key=="D" and MV.flySpeed or -MV.flySpeed))
    end)
end

test("diagonal movement is capped at chosen speed",function(m,h,MV,E)
    MV.SetFlySpeed(100); MV.SetFly(true); m.keys.W=true; m.keys.D=true; m:frame()
    near(MV._bv.Velocity.Magnitude,100)
    near(MV._bv.Velocity.X,math.sqrt(0.5)*100)
end)

test("opposing keys cancel, even with a stale Humanoid.MoveDirection",function(m,h,MV,E)
    MV.SetFly(true); MV.Hum().MoveDirection=E.Vector3.new(1,0,0)
    m.keys.W=true; m.keys.S=true; m:frame(); vec(MV._bv.Velocity,E.Vector3.zero)
end)

for _,key in ipairs({"Space","LeftShift","LeftControl"}) do
    test(key.." supplies manual vertical control",function(m,h,MV,E)
        camera(m,E.Vector3.new(1,0,0)); MV.SetFly(true); m.keys[key]=true; m:frame()
        vec(MV._bv.Velocity,E.Vector3.new(0,key=="Space" and MV.flySpeed or -MV.flySpeed,0))
    end)
end

test("opposing vertical controls cancel",function(m,h,MV,E)
    MV.SetFly(true); m.keys.Space=true; m.keys.LeftShift=true; m:frame()
    vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("diagonal plus vertical input never exceeds selected speed",function(m,h,MV,E)
    MV.SetFly(true); m.keys.W=true; m.keys.D=true; m.keys.Space=true; m:frame()
    near(MV._bv.Velocity.Magnitude,MV.flySpeed)
end)

test("built-in mobile/gamepad MoveDirection is converted back to camera intent",function(m,h,MV,E)
    local look=E.Vector3.new(0.5,-math.sqrt(3)/2,0)
    camera(m,look); MV.SetFly(true); MV.Hum().MoveDirection=E.Vector3.new(1,0,0); m:frame()
    vec(MV._bv.Velocity,look*MV.flySpeed)
end)

test("dedicated virtual joystick follows camera pitch without using Safe input",function(m,h,MV,E)
    local look=E.Vector3.new(0,-math.sqrt(3)/2,-0.5)
    camera(m,look); MV.SetFly(true); MV.SetFlyVirtual(0,-1,0); m:frame()
    vec(MV._bv.Velocity,look*MV.flySpeed)
    assert(MV.Safe._virtX==0 and MV.Safe._virtZ==0 and MV.Safe._virtY==0)
end)

test("analog input preserves partial speed",function(m,h,MV,E)
    MV.SetFlySpeed(100); MV.SetFly(true); MV.SetFlyVirtual(0,-0.25,0); m:frame()
    near(MV._bv.Velocity.Magnitude,25)
end)

test("missing/replaced camera safely hovers then resumes",function(m,h,MV,E)
    MV.SetFly(true); m.keys.W=true; local old=E.workspace.CurrentCamera
    E.workspace.CurrentCamera=nil; m:frame(); vec(MV._bv.Velocity,E.Vector3.zero)
    local replacement=m.new("Camera",E.workspace); E.workspace.CurrentCamera=replacement
    camera(m,E.Vector3.new(1,0,0)); m:frame(); vec(MV._bv.Velocity,E.Vector3.new(MV.flySpeed,0,0))
    assert(old~=replacement)
end)

test("typing in any TextBox suppresses flight input",function(m,h,MV,E)
    MV.SetFly(true); m.keys.W=true; h.S.flyBtns.speed:CaptureFocus(); m:frame()
    vec(MV._bv.Velocity,E.Vector3.zero)
    h.S.flyBtns.speed:ReleaseFocus(); m:frame(); near(MV._bv.Velocity.Magnitude,MV.flySpeed)
end)

test("losing window focus clears virtual input and stops motion",function(m,h,MV,E)
    MV.SetFly(true); m.keys.W=true; m:frame()
    m.input.WindowFocusReleased:Fire(); m:frame(); vec(MV._bv.Velocity,E.Vector3.zero)
    m.input.WindowFocused:Fire(); m:frame(); near(MV._bv.Velocity.Magnitude,MV.flySpeed)
end)

test("hiding HUD clears held touch input and can be undone in main panel",function(m,h,MV,E)
    MV.SetFly(true); local t=touch(E,0,0)
    m:find("FlyForward").InputBegan:Fire(t); m:frame(); near(MV._bv.Velocity.Magnitude,MV.flySpeed)
    m:find("FlyHudHide").Activated:Fire(); m:frame()
    assert(MV.fly and not MV.Flight.hud.Visible); vec(MV._bv.Velocity,E.Vector3.zero)
    h.S.flyBtns.hud.Activated:Fire(); assert(MV.Flight.hud.Visible)
    m:frame(); vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("unrelated camera finger neither moves nor releases held joystick",function(m,h,MV,E)
    MV.SetFly(true)
    local joy=m:find("FlyJoystick"); local center=joy.AbsolutePosition+joy.AbsoluteSize*0.5
    local held=touch(E,center.X,center.Y-38); local other=touch(E,900,400)
    joy.InputBegan:Fire(held); m.input.InputChanged:Fire(other); m.input.InputEnded:Fire(other); m:frame()
    assert(MV.Flight.joyInput==held); near(MV._bv.Velocity.Magnitude,MV.flySpeed)
    m.input.InputEnded:Fire(held); m:frame(); vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("multi-touch vertical hold survives release of the joystick finger",function(m,h,MV,E)
    MV.SetFly(true)
    local joy=m:find("FlyJoystick"); local center=joy.AbsolutePosition+joy.AbsoluteSize*0.5
    local forward=touch(E,center.X,center.Y-38); local up=touch(E,0,0)
    joy.InputBegan:Fire(forward); m:find("FlyUp").InputBegan:Fire(up)
    m.input.InputEnded:Fire(forward); m:frame()
    vec(MV._bv.Velocity,E.Vector3.new(0,MV.flySpeed,0))
    m.input.InputEnded:Fire(up); m:frame(); vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("opposing HUD direction holds cancel even with stale world movement",function(m,h,MV,E)
    MV.SetFly(true); MV.Hum().MoveDirection=E.Vector3.new(0,0,-1)
    m:find("FlyForward").InputBegan:Fire(touch(E,0,0))
    m:find("FlyBack").InputBegan:Fire(touch(E,0,0)); m:frame()
    vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("mouse release outside a direction button stops it",function(m,h,MV,E)
    MV.SetFly(true)
    local down={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.zero}
    m:find("FlyForward").InputBegan:Fire(down); m:frame()
    near(MV._bv.Velocity.Magnitude,MV.flySpeed)
    m.input.InputEnded:Fire({UserInputType=E.Enum.UserInputType.MouseButton1}); m:frame()
    vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("HUD dragging tracks only its initiating pointer",function(m,h,MV,E)
    MV.SetFly(true); local hud=MV.Flight.hud; local old=hud.Position
    local drag=touch(E,10,10); local other=touch(E,600,600)
    m:find("FlyHudTitle").InputBegan:Fire(drag)
    m.input.InputChanged:Fire(other); assert(hud.Position==old)
    drag.Position=E.Vector3.new(30,50,0); m.input.InputChanged:Fire(drag)
    near(hud.Position.X.Offset,old.X.Offset+20); near(hud.Position.Y.Offset,old.Y.Offset+40)
    m.input.InputEnded:Fire(drag); assert(MV.Flight.dragInput==nil)
end)

test("HUD remains usable when main menu is closed",function(m,h,MV,E)
    MV.SetFly(true); h.main.Visible=false; MV.SyncHud()
    assert(MV.Flight.hud.Visible and MV.Flight.hud.Parent==h.gui)
    local t=touch(E,0,0); m:find("FlyDown").InputBegan:Fire(t); m:frame()
    vec(MV._bv.Velocity,E.Vector3.new(0,-MV.flySpeed,0))
end)

test("HUD stop button disables flight, not the independent noclip toggle",function(m,h,MV,E)
    MV.SetNoclip(true); MV.SetFly(true); m:find("FlyHudStop").Activated:Fire()
    assert(not MV.fly and MV.noclip and not MV._bv and not m.bindings.Fly)
    assert(not MV.Flight.hud.Visible)
end)

test("flight uses safe-style force and post-camera render priority",function(m,h,MV,E)
    MV.SetFly(true)
    vec(MV._bv.MaxForce,E.Vector3.new(1e9,1e9,1e9)); near(MV._bg.P,1e4); near(MV._bg.D,50)
    assert(#m.bindings.Fly==1 and m.bindings.Fly[1].priority==E.Enum.RenderPriority.Camera.Value+1)
end)

test("enabling repeatedly is idempotent",function(m,h,MV,E)
    MV.SetFly(true); local bv,bg,thread=MV._bv,MV._bg,MV._wd
    for _=1,10 do MV.SetFly(true) end
    assert(MV._bv==bv and MV._bg==bg and MV._wd==thread)
    assert(m:count("BC_FlyVel")==1 and m:count("BC_FlyGyro")==1 and #m.bindings.Fly==1)
end)

test("normal frames do not allocate Instances or write character/camera CFrame",function(m,h,MV,E)
    MV.SetFly(true); local created=#m.instances; local writes=m.cfWrites
    local cf=E.workspace.CurrentCamera.CFrame
    m.keys.W=true; frames(m,120)
    assert(#m.instances==created,"allocated instance(s) in steady state")
    assert(m.cfWrites==writes and E.workspace.CurrentCamera.CFrame==cf)
end)

test("stopping restores the original Humanoid flags and leaves game speed unchanged",function(m,h,MV,E)
    local hum=MV.Hum(); hum.AutoRotate=false; hum.PlatformStand=false; hum.WalkSpeed=27; hum.JumpPower=73
    MV.SetFly(true); assert(hum.PlatformStand and not hum.AutoRotate)
    MV.SetFly(false)
    assert(not hum.PlatformStand and not hum.AutoRotate)
    near(hum.WalkSpeed,27); near(hum.JumpPower,73)
    assert(m:count("BC_FlyVel")==0 and m:count("BC_FlyGyro")==0 and m:count("BC_FlyFloor")==0)
end)

test("flight can be switched off while character is absent",function(m,h,MV,E)
    MV.SetFly(true); m.player.Character=nil; m:frame()
    h.S.flyBtns.on.Activated:Fire()
    assert(not MV.fly and not m.bindings.Fly)
end)

test("no live character prevents enabling without creating movers",function(m,h,MV,E)
    MV.Hum().Health=0
    local ok,err=MV.SetFly(true)
    assert(not ok and err and not MV.fly and not MV._bv and not MV._wd)
end)

test("direct character replacement detaches movers from the still-alive old model",function(m,h,MV,E)
    MV.SetFly(true); local oldRoot,oldHum=MV.Root(),MV.Hum()
    local char,root,hum=m:character(); hum.AutoRotate=false
    m:frame()
    assert(MV._bv.Parent==root and not oldRoot:FindFirstChild("BC_FlyVel") and not oldHum.PlatformStand)
    MV.SetFly(false); assert(not hum.AutoRotate and not hum.PlatformStand)
end)

test("death removes old movers while retaining requested flight state for respawn",function(m,h,MV,E)
    MV.SetFly(true); MV.Hum().Health=0; m:frame()
    assert(MV.fly and not MV._bv)
    m:character(); m:frame(); assert(MV.fly and MV._bv.Parent==MV.Root())
end)

test("respawn survives delayed character assembly and restores old humanoid flags",function(m,h,MV,E)
    MV.SetFly(true); local oldHum=MV.Hum(); local oldBv=MV._bv
    m.player.Character=nil; m:frame(); MV.Refresh()
    assert(MV.fly and not MV._bv and oldBv.Parent==nil and not oldHum.PlatformStand)
    local char,root,hum=m:character(); hum.WalkSpeed=31; hum.JumpPower=65
    m.player.CharacterAdded:Fire(char); m:advance(0.35); m:frame()
    assert(MV.fly and MV._bv.Parent==root and hum.PlatformStand)
    near(hum.WalkSpeed,31); near(hum.JumpPower,65)
    assert(m:count("BC_FlyVel")==1 and m:count("BC_FlyGyro")==1)
end)

for _,key in ipairs({"_bv","_bg","_floor"}) do
    test("deleted "..key.." is repaired without duplicating other movers",function(m,h,MV,E)
        MV.SetFly(true); local old=MV[key]; old:Destroy(); m:frame()
        assert(MV[key]~=old and MV[key].Parent)
        assert(m:count("BC_FlyVel")==1 and m:count("BC_FlyGyro")==1 and m:count("BC_FlyFloor")==1)
    end)
end

test("watchdog runs immediately, repeats, remains single, and stops cleanly",function(m,h,MV,E)
    local calls=0; local keep=MV._KeepAlive
    MV._KeepAlive=function() calls+=1; keep() end
    MV.SetFly(true); assert(calls==1)
    local thread=MV._wd; assert(coroutine.status(thread)=="suspended")
    MV._Watchdog(); assert(MV._wd==thread)
    m:advance(0.35); assert(calls>=2)
    MV.SetFly(false); assert(not MV._wd and not MV._wdToken and coroutine.status(thread)=="dead")
    local stopped=calls; m:advance(1); assert(calls==stopped)
    MV.SetFly(true); assert(MV._wd~=thread and calls>stopped)
end)

test("watchdog restores a removed render binding without toggling flight off",function(m,h,MV,E)
    MV.SetFly(true); local bv=MV._bv
    m.run:UnbindFromRenderStep("Fly"); m:advance(1)
    assert(MV.fly and MV._bv==bv and #m.bindings.Fly==1)
end)

test("turning off an unused speed feature does not overwrite game properties",function(m,h,MV,E)
    MV.Hum().WalkSpeed=32; MV.Hum().JumpPower=77
    MV.SetSpeed(false); MV.Refresh(); MV.StopAll()
    near(MV.Hum().WalkSpeed,32); near(MV.Hum().JumpPower,77)
end)

test("flight never automatically enables noclip",function(m,h,MV,E)
    MV.SetFly(true); frames(m,60); assert(not MV.noclip and MV.Root().CanCollide)
    MV.SetFly(false); assert(not MV.noclip)
end)

test("existing enabled noclip survives a complete flight on/off cycle",function(m,h,MV,E)
    MV.SetNoclip(true); MV.SetFly(true); MV.SetFly(false)
    assert(MV.noclip and not MV.Root().CanCollide)
end)

test("main-panel noclip can turn on and off during flight and restores original collisions",function(m,h,MV,E)
    local accessory=m.new("Part",m.player.Character); accessory.Name="Accessory"; accessory.CanCollide=false
    MV.SetFly(true); h.S.flyBtns.noclip.Activated:Fire(); m:frame()
    assert(MV.fly and MV.noclip and not MV.Root().CanCollide and not accessory.CanCollide)
    h.S.flyBtns.noclip.Activated:Fire(); m:frame()
    assert(MV.fly and not MV.noclip and MV.Root().CanCollide and not accessory.CanCollide)
    assert(h.S.flyBtns.noclip.Text:find("TẮT",1,true))
end)

test("old noclip card and new noclip button share the same state",function(m,h,MV,E)
    h.S.RunHubAction("noclip")
    assert(MV.noclip and h.S.flyBtns.noclip.Text:find("BẬT",1,true))
    h.S.flyBtns.noclip.Activated:Fire(); assert(not MV.noclip)
end)

test("noclip can be disabled during a respawn gap",function(m,h,MV,E)
    MV.SetNoclip(true); m.player.Character=nil; h.S.flyBtns.noclip.Activated:Fire()
    assert(not MV.noclip and not m.bindings.BC_NoClip)
end)

test("NoClip assist cannot write CFrame while camera-flight is active",function(m,h,MV,E)
    MV.SetFly(true); MV.SetNoclip(true); m.keys.W=true; MV.Hum().MoveDirection=E.Vector3.new(0,0,-1)
    local writes=m.cfWrites; frames(m,120)
    assert(m.cfWrites==writes,"NoClip assist fought manual flight")
end)

test("switching safe -> manual removes autonomous movers without deleting safe settings",function(m,h,MV,E)
    MV.Safe.Set(true); m:frame(); assert(MV.Safe.on and MV.Safe._bv)
    MV.SetFly(true); m:frame()
    assert(MV.fly and not MV.Safe.on and not MV.Safe._bv and not MV.Safe._shield and not m.bindings.BC_Safe)
    assert(MV.Safe.auto and MV.Safe.circle and MV.Safe.avoidPlayers and MV.Safe.shield)
    vec(MV._bv.Velocity,E.Vector3.zero)
end)

test("switching manual -> safe leaves only the safe mover active",function(m,h,MV,E)
    MV.SetFly(true); MV.Safe.Set(true); m:frame()
    assert(not MV.fly and not MV._bv and not m.bindings.Fly and MV.Safe.on and MV.Safe._bv)
    assert(not MV.Flight.hud.Visible)
end)

test("safe flight still has its circle, avoidance and shield features",function(m,h,MV,E)
    MV.Safe.Set(true); m:frame()
    assert(MV.Safe.circle and MV.Safe.avoidPlayers and MV.Safe.shield and MV.Safe.auto)
    assert(MV.Safe._shield and #MV.Safe._shield==4 and MV.Safe._bv.Velocity.Magnitude>0)
    assert(m:find("SafeAuto") and m:find("SafePlayers") and m:find("SafeShield"))
end)

test("inactive safe stop does not stop manual flight",function(m,h,MV,E)
    MV.SetFly(true); MV.Safe.Stop(); m:frame()
    assert(MV.fly and MV._bv and MV.Hum().PlatformStand and not MV.Hum().AutoRotate)
end)

test("glass travel and manual flight hand over instead of competing",function(m,h,MV,E)
    MV.PlaceGlass(); MV._placedGlasses[1].Position=E.Vector3.new(100,25,0)
    MV.SetFly(true); assert(MV.FlyToGlass(1)); m:frame()
    assert(not MV.fly and not MV._bv and MV._glassFlyActive and MV._glassFlyBV)
    MV.SetFly(true); m:frame()
    assert(MV.fly and not MV._glassFlyActive and not MV._glassFlyBV and not m.bindings.BC_GlassFly)
    assert(#MV._placedGlasses==1,"lost placed glass")
end)

test("invalid glass target does not disable manual flight",function(m,h,MV,E)
    MV.SetFly(true); assert(not MV.FlyToGlass(999)); assert(MV.fly and MV._bv)
end)

test("player travel and manual flight hand over instead of competing",function(m,h,MV,E)
    local other=otherPlayer(m,E)
    MV.SetFly(true); assert(MV.FlyToPlayer(other)); m:frame()
    assert(not MV.fly and not MV._bv and MV._playerFlyActive and MV._playerFlyBV)
    MV.SetFly(true); m:frame()
    assert(MV.fly and not MV._playerFlyActive and not MV._playerFlyBV and not m.bindings.BC_PlayerFly)
end)

test("run-on-carpet still works and switches safely to manual flight",function(m,h,MV,E)
    MV.Hum().WalkSpeed=22; MV.SetRunMode(true); m:frame()
    assert(MV.runMode and MV.carpet and MV._carpet and MV.speed and not h.main.Visible)
    near(MV.Hum().WalkSpeed,66)
    MV.SetFly(true); m:frame()
    assert(MV.fly and not MV.runMode and not MV.carpet and not MV.speed)
    near(MV.Hum().WalkSpeed,22)
end)

test("carpet retains size, raise/lower and its original HUD",function(m,h,MV,E)
    MV.SetFly(true); MV.SetCarpetSize(12,1,14); MV.SetCarpet(true)
    assert(not MV.fly and MV.carpet and MV._hud.Visible)
    vec(MV._carpet.Size,E.Vector3.new(12,1,14))
    local y=MV.carpetY; MV.Nudge(2.5); near(MV.carpetY,y+2.5)
    MV.SetCarpet(false); assert(not MV._carpet)
end)

test("infinite-jump input does not fight manual flight",function(m,h,MV,E)
    MV.SetInfJump(true); MV.SetFly(true)
    local before=MV.Root().AssemblyLinearVelocity
    assert(MV._DoJump()==false); m:frame()
    vec(MV.Root().AssemblyLinearVelocity,before)
    MV.SetFly(false); assert(MV.infJump); MV.SetInfJump(false)
end)

test("glow, ESP and spectator remain available independently",function(m,h,MV,E)
    local other=otherPlayer(m,E)
    h.S.Glow.Set(true); h.S.Loc.Set(true); h.S.Spec.Set(other)
    MV.SetFly(true); frames(m,30); MV.SetFly(false)
    assert(h.S.Glow.on and h.S.Loc.on and h.S.Spec.on)
    assert(m.bindings.BC_Glow and m.bindings.BC_Loc and m.bindings.BC_Spec)
    h.S.Spec.Stop(); h.S.Loc.StopAll(); h.S.Glow.Stop()
end)

test("stop-all cleans movement, watchdog and input, but retains placed glass",function(m,h,MV,E)
    MV.PlaceGlass(); MV.SetFly(true); MV.SetNoclip(true); MV.SetFlyVirtual(0,-1,1)
    MV.StopAll(); frames(m,30)
    assert(not MV.fly and not MV.noclip and not MV._bv and not MV._wd and not MV._wdToken)
    assert(not m.bindings.Fly and not m.bindings.BC_NoClip)
    assert(#MV._placedGlasses==1 and MV._placedGlasses[1].Parent)
    assert(next(MV.Flight.holds)==nil and MV.Flight.x==0 and MV.Flight.y==0 and MV.Flight.z==0)
end)

test("main speed input applies immediately and old panel Text properties remain strings",function(m,h,MV,E)
    MV.SetFly(true); h.S.flyBtns.speed.Text="140"; h.S.flyBtns.apply.Activated:Fire()
    m.keys.W=true; m:frame(); near(MV._bv.Velocity.Magnitude,140)
    h.S.RefreshMovePanel(); assert(h.S.flyBtns.speed.Text=="140")
    assert(#m.propertyErrors==0)
end)

test("old movement speed control synchronizes the new flight panel",function(m,h,MV,E)
    local panel=m:find("HubMove_Panel"); local input,apply
    for _,child in ipairs(panel:GetChildren()) do
        if child.Position and child.Position.X and type(child.Position.X)=="table" then
            if child.ClassName=="TextBox" and child.Position.X.Offset==62 and child.Position.Y.Offset==22 then input=child end
            if child.ClassName=="TextButton" and child.Position.X.Offset==308 and child.Position.Y.Offset==22 then apply=child end
        end
    end
    assert(input and apply); input.Text="750"; apply.Activated:Fire()
    assert(MV.flySpeed==750 and h.S.flyBtns.speed.Text=="750")
end)

test("speed values are validated and clamped to 1..2000",function(m,h,MV,E)
    assert(MV.SetFlySpeed(5000)); near(MV.flySpeed,2000)
    assert(MV.SetFlySpeed(-1)); near(MV.flySpeed,1)
    assert(not MV.SetFlySpeed("not a speed")); assert(not MV.SetFlySpeed(0/0)); assert(not MV.SetFlySpeed(math.huge))
    near(MV.flySpeed,1)
end)

test("panel refresh does not erase the speed value currently being typed",function(m,h,MV,E)
    local box=h.S.flyBtns.speed; box:CaptureFocus(); box.Text="123"
    MV.SyncFlyHud(); h.S.RebuildHubList(); assert(box.Text=="123")
    box:ReleaseFocus(true); near(MV.flySpeed,123)
end)

test("search/filter never destroys the flight controls or existing panels",function(m,h,MV,E)
    local panel=h.S.flyBtns.panel
    h.S.hubSearch="no-such-script"; h.S.RebuildHubList()
    assert(h.S.flyBtns.panel==panel and panel.Parent and m:find("HubMove_Panel") and m:find("HubSafe_Panel"))
    h.S.hubSearch=""; h.S.hubCat="Di chuyển"; h.S.RebuildHubList()
    assert(panel.Parent and h.D.hubList.CanvasSize.Y.Offset>panel.Size.Y.Offset)
    h.S.hubCat="Tất cả"; h.S.RebuildHubList(); assert(#h.S.ScriptHubList==32)
end)

test("destroyed manual HUD is rebuilt without leaking service connections",function(m,h,MV,E)
    MV.SetFly(true); local changed=m.input.InputChanged:Count(); local ended=m.input.InputEnded:Count()
    MV.Flight.hud:Destroy(); MV.SyncHud()
    assert(MV.Flight.hud.Parent and MV.Flight.hud.Visible)
    assert(m.input.InputChanged:Count()==changed and m.input.InputEnded:Count()==ended)
end)

test("reloading hub cleans old flight movers, noclip, watchdog and input listeners",function(m,h,MV,E)
    local baseChanged=m.input.InputChanged:Count(); local baseEnded=m.input.InputEnded:Count()
    MV.SetFly(true); MV.SetNoclip(true); local oldThread=MV._wd
    local nextHub=m:load(hubSource); m:advance(0.05)
    assert(not MV.fly and not MV.noclip and not MV._wd and coroutine.status(oldThread)=="dead")
    assert(m:count("BC_FlyVel")==0 and m:count("BC_FlyGyro")==0 and not m.bindings.Fly)
    assert(MV.Root().CanCollide and not MV.Hum().PlatformStand)
    assert(m.input.InputChanged:Count()==baseChanged,"InputChanged listeners leaked on reload")
    assert(m.input.InputEnded:Count()==baseEnded,"InputEnded listeners leaked on reload")
    assert(nextHub.S.Move~=MV and #nextHub.tabs==7)
end)

print(string.format("\n%d passed / %d failed — actual full hub in a deterministic mock; no real Roblox physics or network scripts.",passed,failed))
assert(failed==0,"flight regression tests failed")
