-- These tests run the complete real hub. They do not simulate Roblox physics or anti-cheat.
local passed, failed = 0, 0
local function near(a,b,eps)
    assert(type(a)=="number" and type(b)=="number" and math.abs(a-b)<(eps or 1e-5),
        "expected "..tostring(b)..", got "..tostring(a))
end
local function vec(a,b) near(a.X,b.X); near(a.Y,b.Y); near(a.Z,b.Z) end
local function frames(m,n) for _=1,n do m:frame() end end
local function test(name,fn)
    local ok,err=pcall(function()
        local m=createMock()
        local h=m:load(hubSource)
        m:advance(0.05)
        fn(m,h,h.S.GroundSpeed,h.S.Move,m.env)
        m:assertClean()
    end)
    if ok then passed+=1; print("PASS "..name)
    else failed+=1; print("FAIL "..name.."\n  "..tostring(err)) end
end
local function show(h)
    h.main.Visible=true
    for _,tab in ipairs(h.tabs) do
        if tab:GetAttribute("BCTabName")=="Script Hub" then tab.Activated:Fire(); break end
    end
    assert(h.D.hubTab.Visible)
    return h.S.groundSpeedControls
end
local function pointer(h,E,kind,pct)
    local slider=h.S.groundSpeedControls.slider
    local p=slider.AbsolutePosition; local size=slider.AbsoluteSize
    assert(size.X>0)
    return {UserInputType=E.Enum.UserInputType[kind],Position=E.Vector3.new(p.X+size.X*pct,p.Y+size.Y/2,0)}
end
local function actionButton(m)
    local card=assert(m:find("HubCard_Tốc Độ Chạy (mặt đất)"))
    for _,c in ipairs(card:GetChildren()) do
        if c:IsA("TextButton") and c.Text:find("🏃",1,true) then return c end
    end
    error("ground speed action button missing")
end
local function otherPlayer(m,E)
    local p=m.new("Player",E.game:GetService("Players")); p.Name="OtherTester"; p.UserId=2
    m:character(p,E.Vector3.new(50,30,0))
    return p
end

test("additive panel and card preserve all 31 named legacy cards and 7 tabs",function(m,h,GS,MV,E)
    assert(#h.tabs==7 and #h.S.ScriptHubList==32 and GS==MV.GroundSpeed)
    local names={}
    for _,card in ipairs(h.S.ScriptHubList) do names[card.name]=true end
    for _,name in ipairs({"Infinite Yield","Dex Explorer","SimpleSpy v3","Niêm tâm (Crosshair)",
        "Trả GUI về màn hình","Sửa kẹt chuột","Nạp lại hub từ đĩa","Dọn host nhúng rác",
        "Reset Server","Hop Server","Lấy mã server (JobId)","Bay","Xuyên Tường","Nhảy Vô Hạn",
        "Chạy Trên Thảm","Đặt Kính","Đặt 1 Tấm Kính Dưới Chân","Xóa Kính Đã Đặt","Tự Đặt Kính",
        "Quản Lý Kính (trong Người Chơi)","Bay Tới Kính","Dừng Bay Tới Kính","Bay Tới Người Chơi",
        "Dừng Bay Tới Người","Phát Sáng","Bay An Toàn","Định Vị Người Chơi","Định Vị Lẻ",
        "Xem Người Chơi","Dừng Xem Người Chơi","Tắt Định Vị"}) do assert(names[name],"lost "..name) end
    local b=show(h)
    for _,key in ipairs({"on","stop","reset","value","apply","slider","observed","limit","status"}) do
        assert(b[key].Parent==b.panel,"missing main-panel control "..key)
    end
    assert(b.panel.Parent==h.D.hubList and b.panel.LayoutOrder<h.S.flyBtns.panel.LayoutOrder)
    assert(m:find("HubFly_Panel") and m:find("HubSafe_Panel") and m:find("HubMove_Panel"))
    assert(m:find("GroundSpeedWarning").Text:find("KHÔNG bảo đảm",1,true))
end)

test("starts off at observed game speed without changing the character",function(m,h,GS,MV,E)
    assert(not GS.on); near(GS.gameSpeed,16); near(GS.limit,16); near(GS.value,16)
    near(GS.observedMax,16); near(MV.Hum().WalkSpeed,16)
    assert(not GS.reason:find("Chưa đọc",1,true))
    assert(h.S.groundSpeedControls.value.Text=="16")
end)

test("selection while off is clamped but never applied until enabling",function(m,h,GS,MV,E)
    assert(GS.SetValue(8)); near(GS.value,8); near(MV.Hum().WalkSpeed,16)
    assert(GS.Set(true)); near(MV.Hum().WalkSpeed,8)
    assert(h.S.MoveActionState.groundspeed() and MV.Status():find("mặt đất",1,true))
end)

test("only WalkSpeed is written; no ground controller physics or humanoid-state edits",function(m,h,GS,MV,E)
    local hum,root=MV.Hum(),MV.Root()
    hum.JumpPower=73; hum.JumpHeight=6; hum.AutoRotate=false
    local velocity=E.Vector3.new(1,-7,3); root.AssemblyLinearVelocity=velocity
    local cf=root.CFrame; local cam=E.workspace.CurrentCamera; local oldCamera=cam.CFrame
    local gravity=E.workspace.Gravity; local cfWrites=m.cfWrites
    m.humanoidWrites={}
    assert(GS.SetValue(7)); assert(GS.Set(true)); frames(m,60); GS.Set(false)
    near(hum.WalkSpeed,16); near(hum.JumpPower,73); near(hum.JumpHeight,6)
    assert(not hum.AutoRotate and not hum.PlatformStand and root.CanCollide)
    for key in pairs(m.humanoidWrites) do assert(key=="WalkSpeed","unexpected Humanoid write: "..key) end
    assert(m.humanoidWrites.WalkSpeed==2)
    assert(root.CFrame==cf and cam.CFrame==oldCamera and m.cfWrites==cfWrites)
    vec(root.AssemblyLinearVelocity,velocity); near(E.workspace.Gravity,gravity)
    for _,obj in ipairs(root:GetChildren()) do
        assert(not obj:IsA("BodyVelocity") and not obj:IsA("BodyGyro") and not obj:IsA("LinearVelocity"))
    end
    assert(not MV._wd and not MV._bv and not MV._bg and not MV._carpet)
end)

test("camera pitch, native joystick, WASD and Space do not make ground controller apply flight",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local root=MV.Root(); local before=root.CFrame; local writes=m.cfWrites
    local velocity=root.AssemblyLinearVelocity
    for _,pitch in ipairs({-90,-60,0,60,90}) do
        local angle=math.rad(pitch)
        E.workspace.CurrentCamera.CFrame=E.CFrame.lookAt(E.Vector3.new(0,30,0),
            E.Vector3.new(0,30+math.sin(angle),-math.cos(angle)))
        m.keys.W=true; m.keys.Space=true; MV.Hum().MoveDirection=E.Vector3.new(0,0,-1)
        m.input.JumpRequest:Fire(); frames(m,15)
        assert(not MV.fly and not MV.Safe.on and not MV.infJump and not MV.noclip and not MV._bv)
        vec(root.AssemblyLinearVelocity,velocity)
    end
    assert(root.CFrame==before and m.cfWrites==writes and not MV.Hum().PlatformStand)
    near(MV.Hum().WalkSpeed,8)
end)

test("ground control creates no virtual HUD, even when the menu is closed",function(m,h,GS,MV,E)
    local created=#m.instances
    GS.Set(true); h.main.Visible=false; frames(m,120)
    assert(#m.instances==created,"new instances created by ground mode")
    for _,name in ipairs({"BC_FlyHud","BC_SafeHud","BC_MoveHud"}) do
        local hud=m:find(name); assert(not hud or not hud.Visible,"virtual HUD enabled: "..name)
    end
    assert(not m:find("BC_GroundSpeedHud") and not m.bindings.Fly and not m.bindings.BC_Safe)
end)

test("idle heartbeat observes but never repeatedly writes speed or starts a watchdog",function(m,h,GS,MV,E)
    GS.SetValue(9.5); GS.Set(true)
    local writes=m.humanoidWrites.WalkSpeed; local instances=#m.instances
    local signals=MV.Hum():GetPropertyChangedSignal("WalkSpeed"):Count()
    frames(m,600)
    assert(m.humanoidWrites.WalkSpeed==writes and #m.instances==instances)
    assert(MV.Hum():GetPropertyChangedSignal("WalkSpeed"):Count()==signals and not MV._wd)
    near(GS.gameSpeed,16); near(GS.limit,16); near(GS.observedMax,16)
end)

test("numeric input supports decimals and Enter, with slider and label synchronized",function(m,h,GS,MV,E)
    local b=show(h); GS.Set(true)
    b.value:CaptureFocus(); b.value.Text="12.5"; b.value:ReleaseFocus(true)
    near(GS.value,12.5); near(MV.Hum().WalkSpeed,12.5); assert(b.value.Text=="12.5")
    near(b.fill.Size.X.Scale,12.5/16); near(b.thumb.Position.X.Scale,12.5/16)
    b.value:CaptureFocus(); b.value.Text="7.25"; b.apply.Activated:Fire()
    near(MV.Hum().WalkSpeed,7.25); assert(not b.value:IsFocused())
end)

for _,case in ipairs({{input="999999999",want=16},{input="-50",want=0},{input="0",want=0}}) do
    test("numeric value "..case.input.." is bounded by 0 and the current observed cap",function(m,h,GS,MV,E)
        local b=show(h); GS.Set(true); b.value.Text=case.input; b.apply.Activated:Fire()
        near(GS.value,case.want); near(MV.Hum().WalkSpeed,case.want); near(GS.limit,16)
        near(b.fill.Size.X.Scale,case.want/16)
    end)
end

for _,invalid in ipairs({"","hello","1e999",math.huge,-math.huge,0/0}) do
    test("rejects non-finite or non-numeric input "..tostring(invalid),function(m,h,GS,MV,E)
        GS.SetValue(10); GS.Set(true)
        local ok,err=GS.SetValue(invalid)
        assert(not ok and type(err)=="string"); near(GS.value,10); near(MV.Hum().WalkSpeed,10)
        near(GS.limit,16); assert(GS.on)
    end)
end

test("bad text input reports an error and restores the displayed value",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(9); GS.Set(true)
    b.value:CaptureFocus(); b.value.Text="invalid"; b.apply.Activated:Fire()
    assert(b.value.Text=="9" and h.D.hubStatus.Text:find("hữu hạn",1,true))
    near(MV.Hum().WalkSpeed,9)
end)

test("refresh and search do not overwrite a value being typed",function(m,h,GS,MV,E)
    local b=show(h); b.value:CaptureFocus(); b.value.Text="11.25"
    frames(m,60); MV.Refresh(); h.S.RebuildHubList()
    assert(b.value.Text=="11.25")
    b.value:ReleaseFocus(true); near(GS.value,11.25)
    assert(not GS.on); near(MV.Hum().WalkSpeed,16)
end)

test("mouse slider supports left, middle, right, outside clamping and release outside",function(m,h,GS,MV,E)
    local b=show(h); GS.Set(true)
    b.slider.InputBegan:Fire(pointer(h,E,"MouseButton1",0))
    near(GS.value,0); assert(not h.D.hubList.ScrollingEnabled)
    m.input.InputChanged:Fire(pointer(h,E,"MouseMovement",0.5)); near(GS.value,8)
    m.input.InputChanged:Fire(pointer(h,E,"MouseMovement",2)); near(GS.value,16)
    m.input.InputChanged:Fire(pointer(h,E,"MouseMovement",-1)); near(GS.value,0)
    m.input.InputEnded:Fire(pointer(h,E,"MouseButton1",2)); assert(h.D.hubList.ScrollingEnabled)
    m.input.InputChanged:Fire(pointer(h,E,"MouseMovement",1)); near(GS.value,0)
    assert(b.value.Text=="0"); near(MV.Hum().WalkSpeed,0)
end)

test("touch slider tracks its initiating finger and ignores a second touch or mouse",function(m,h,GS,MV,E)
    local b=show(h)
    local held=pointer(h,E,"Touch",0.25); local other=pointer(h,E,"Touch",1)
    b.slider.InputBegan:Fire(held); near(GS.value,4)
    b.slider.InputBegan:Fire(other); m.input.InputChanged:Fire(other); m.input.InputEnded:Fire(other)
    m.input.InputChanged:Fire(pointer(h,E,"MouseMovement",0.8)); near(GS.value,4)
    assert(not h.D.hubList.ScrollingEnabled)
    held.Position=pointer(h,E,"Touch",0.75).Position; m.input.InputChanged:Fire(held)
    near(GS.value,12); assert(b.value.Text=="12")
    m.input.InputEnded:Fire(held); assert(h.D.hubList.ScrollingEnabled)
    held.Position=other.Position; m.input.InputChanged:Fire(held); near(GS.value,12)
end)

test("slider rounds to tenths without rounding beyond a fractional game cap",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=7.23
    local b=show(h); GS.Set(true)
    local held=pointer(h,E,"Touch",1); b.slider.InputBegan:Fire(held)
    near(GS.value,7.23); near(MV.Hum().WalkSpeed,7.23)
    held.Position=pointer(h,E,"Touch",0.333).Position; m.input.InputChanged:Fire(held)
    near(GS.value,2.4); m.input.InputEnded:Fire(held)
end)

test("slider restores a previously disabled scrolling state",function(m,h,GS,MV,E)
    local b=show(h); h.D.hubList.ScrollingEnabled=false
    local t=pointer(h,E,"Touch",0.5); b.slider.InputBegan:Fire(t); m.input.InputEnded:Fire(t)
    assert(not h.D.hubList.ScrollingEnabled)
end)

for _,reason in ipairs({"focus","main menu","tab","panel","ScreenGui"}) do
    test("drag releases on hidden "..reason.." or lost focus",function(m,h,GS,MV,E)
        local b=show(h); local t=pointer(h,E,"Touch",0.5); b.slider.InputBegan:Fire(t)
        assert(not h.D.hubList.ScrollingEnabled)
        if reason=="focus" then m.input.WindowFocusReleased:Fire()
        elseif reason=="main menu" then h.main.Visible=false
        elseif reason=="tab" then h.D.hubTab.Visible=false
        elseif reason=="panel" then b.panel.Visible=false
        else h.gui.Enabled=false end
        assert(h.D.hubList.ScrollingEnabled,"scroll remained locked")
        h.main.Visible=true; h.D.hubTab.Visible=true; b.panel.Visible=true; h.gui.Enabled=true
        t.Position=pointer(h,E,"Touch",1).Position; m.input.InputChanged:Fire(t); near(GS.value,8)
    end)
end

test("keyboard input and invisible slider cannot start a drag",function(m,h,GS,MV,E)
    local b=show(h)
    b.slider.InputBegan:Fire(pointer(h,E,"Keyboard",0)); near(GS.value,16)
    h.main.Visible=false; b.slider.InputBegan:Fire(pointer(h,E,"Touch",0)); near(GS.value,16)
    assert(h.D.hubList.ScrollingEnabled)
end)

test("observed game cap tracks speed changes while off; peak is informational only",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=32; near(GS.limit,32); near(GS.value,32); near(GS.observedMax,32)
    MV.Hum().WalkSpeed=12; near(GS.limit,12); near(GS.value,12); near(GS.observedMax,32)
    local ok,value,clamped=GS.SetValue(25); assert(ok and clamped); near(value,12)
    assert(GS.Set(true)); near(MV.Hum().WalkSpeed,12)
    assert(h.S.groundSpeedControls.observed.Text:find("32",1,true))
end)

test("500 is only a technical control ceiling, never a claimed anti-cheat threshold",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=1200; near(GS.gameSpeed,1200); near(GS.limit,500); near(GS.observedMax,1200)
    GS.SetValue(10000); GS.Set(true); near(MV.Hum().WalkSpeed,500)
    GS.Set(false); near(MV.Hum().WalkSpeed,1200)
end)

test("flight and teleport velocity peaks never become the ground limit",function(m,h,GS,MV,E)
    MV.SetFlySpeed(2000); MV.SetFly(true); m.keys.W=true; frames(m,30)
    h.S.SpeedMeter.max=999999; h.S.SpeedMeter.live=9000
    MV.Root().AssemblyLinearVelocity=E.Vector3.new(9000,9000,9000)
    MV.Root().CFrame=E.CFrame.new(50000,30000,0)
    GS.Set(true); near(GS.limit,16); near(GS.observedMax,16); near(GS.gameSpeed,16)
    assert(not MV.fly and not MV._bv)
end)

test("game lock at zero is respected, not replaced by a Roblox default",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=0
    local ok,err=GS.Set(true); assert(not ok and err and not GS.on)
    near(GS.limit,0); near(MV.Hum().WalkSpeed,0)
    local b=show(h); assert(not b.slider.Active and not b.value.TextEditable)
    b.slider.InputBegan:Fire(pointer(h,E,"Touch",1)); near(MV.Hum().WalkSpeed,0)
    assert(h.D.hubList.ScrollingEnabled)
end)

for _,invalid in ipairs({-1,math.huge,-math.huge,0/0}) do
    test("invalid game WalkSpeed "..tostring(invalid).." disables control without guessing",function(m,h,GS,MV,E)
        MV.Hum().WalkSpeed=invalid
        assert(GS.gameSpeed==nil and GS.limit==nil and GS.value==nil)
        assert(not GS.Set(true) and not GS.SetValue(12) and not GS.UseGameSpeed())
        assert(not h.S.groundSpeedControls.slider.Active and h.S.groundSpeedControls.value.Text=="")
    end)
end

test("unknown or zero game observation recovers to a truthful ready status",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=0/0; MV.Hum().WalkSpeed=18
    assert(GS.limit==18 and not GS.reason:find("Chưa đọc",1,true))
    MV.Hum().WalkSpeed=0; MV.Hum().WalkSpeed=20
    assert(GS.limit==20 and not GS.reason:find("= 0",1,true))
end)

test("synchronous own writes never shrink the observed cap or peak",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=24; GS.SetValue(7); GS.Set(true)
    for _,value in ipairs({0,5,12,23.75}) do
        GS.SetValue(value); frames(m,15)
        assert(GS.on); near(GS.limit,24); near(GS.gameSpeed,24); near(GS.observedMax,24)
    end
end)

test("deferred own property events are not mistaken for game corrections",function(m,h,GS,MV,E)
    m.deferPropertySignals=true
    GS.SetValue(7); GS.Set(true); GS.SetValue(9); GS.SetValue(3.5); m:advance(0.01)
    frames(m,60)
    assert(GS.on); near(GS.limit,16); near(GS.gameSpeed,16); near(GS.observedMax,16)
    GS.Set(false); m:advance(0.01); near(MV.Hum().WalkSpeed,16); near(GS.gameSpeed,16)
end)

for _,value in ipairs({5,16,32,0}) do
    test("game correction to "..value.." automatically yields and never fights back",function(m,h,GS,MV,E)
        GS.SetValue(8); GS.Set(true); MV.Hum().WalkSpeed=value
        assert(not GS.on and GS._applied==nil); near(GS.limit,value); near(GS.gameSpeed,value)
        local writes=m.humanoidWrites.WalkSpeed; frames(m,300)
        assert(m.humanoidWrites.WalkSpeed==writes); near(MV.Hum().WalkSpeed,value)
        GS.Set(false); near(MV.Hum().WalkSpeed,value)
    end)
end

test("deferred external write is sampled before applying a user value",function(m,h,GS,MV,E)
    m.deferPropertySignals=true; GS.SetValue(8); GS.Set(true)
    MV.Hum().WalkSpeed=5; GS.SetValue(12)
    assert(not GS.on); near(GS.limit,5); near(GS.value,5); near(MV.Hum().WalkSpeed,5)
    m:advance(0.02); frames(m,60); near(MV.Hum().WalkSpeed,5)
end)

test("deferred correction to zero cannot be undone by a late UI apply",function(m,h,GS,MV,E)
    m.deferPropertySignals=true; GS.SetValue(8); GS.Set(true)
    MV.Hum().WalkSpeed=0; GS.SetValue(12); m:advance(0.02)
    assert(not GS.on); near(GS.limit,0); near(GS.value,0); near(MV.Hum().WalkSpeed,0)
end)

test("game correction ends a slider drag and refreshes the card as well as the panel",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(8); b.on.Activated:Fire()
    assert(actionButton(m).Text:find("TẮT",1,true))
    local t=pointer(h,E,"Touch",0.5); b.slider.InputBegan:Fire(t)
    MV.Hum().WalkSpeed=4
    assert(not GS.on and h.D.hubList.ScrollingEnabled)
    assert(b.on.Text:find("TẮT",1,true))
    assert(actionButton(m).Text:find("BẬT",1,true),"card still advertises the wrong action")
    t.Position=pointer(h,E,"Touch",1).Position; m.input.InputChanged:Fire(t); near(MV.Hum().WalkSpeed,4)
end)

test("missed property signal is detected by the heartbeat fallback without enforcement",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    MV.Hum()._props.WalkSpeed=6 -- deliberately bypass the mock signal
    frames(m,15); assert(not GS.on); near(GS.limit,6); near(MV.Hum().WalkSpeed,6)
end)

test("write rejection stops cleanly rather than retrying every frame",function(m,h,GS,MV,E)
    GS.SetValue(7); m.rejectWalkSpeed=true
    local ok,err=GS.Set(true); assert(not ok and err and not GS.on)
    near(MV.Hum().WalkSpeed,16); local writes=m.humanoidWrites.WalkSpeed
    frames(m,90); assert(m.humanoidWrites.WalkSpeed==writes)
    m.rejectWalkSpeed=false; GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

test("a game which immediately rewrites an attempted speed owns the final value",function(m,h,GS,MV,E)
    local hum=MV.Hum(); local rewriting=false
    hum:GetPropertyChangedSignal("WalkSpeed"):Connect(function()
        if not rewriting and hum.WalkSpeed~=13 then rewriting=true; hum.WalkSpeed=13; rewriting=false end
    end)
    GS.SetValue(7); assert(not GS.Set(true)); assert(not GS.on)
    near(hum.WalkSpeed,13); near(GS.gameSpeed,13); near(GS.limit,13)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,60); assert(m.humanoidWrites.WalkSpeed==writes)
end)

test("repeated enable is idempotent and disabling restores the actual observed baseline",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=27.5; GS.SetValue(9); GS.Set(true)
    local writes=m.humanoidWrites.WalkSpeed; local conn=GS._humConn
    for _=1,20 do assert(GS.Set(true)) end
    assert(m.humanoidWrites.WalkSpeed==writes and GS._humConn==conn)
    GS.Set(false); near(MV.Hum().WalkSpeed,27.5); near(GS.value,9)
    GS.Set(false); near(MV.Hum().WalkSpeed,27.5)
end)

test("disabling never overwrites a more recent unobserved game write",function(m,h,GS,MV,E)
    m.deferPropertySignals=true; GS.SetValue(8); GS.Set(true)
    MV.Hum().WalkSpeed=23; GS.Set(false); m:advance(0.02)
    near(MV.Hum().WalkSpeed,23); near(GS.gameSpeed,23)
end)

test("reset-to-game clears user selection and follows the next observed baseline",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(8); GS.Set(true); b.reset.Activated:Fire()
    assert(GS.requested==nil and GS.on); near(MV.Hum().WalkSpeed,16); near(GS.value,16)
    MV.Hum().WalkSpeed=24; assert(not GS.on); near(GS.value,24)
    GS.Set(true); near(MV.Hum().WalkSpeed,24)
end)

test("ground card, panel toggle and stop use one shared state",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(9)
    actionButton(m).Activated:Fire(); assert(GS.on and b.on.Text:find("BẬT",1,true))
    b.on.Activated:Fire(); assert(not GS.on); near(MV.Hum().WalkSpeed,16)
    b.on.Activated:Fire(); assert(GS.on)
    b.stop.Activated:Fire(); assert(not GS.on and actionButton(m).Text:find("BẬT",1,true))
    near(MV.Hum().WalkSpeed,16)
end)

test("movement stop-all restores speed without deleting existing glass",function(m,h,GS,MV,E)
    MV.PlaceGlass(); GS.SetValue(7); GS.Set(true); MV.StopAll()
    assert(not GS.on and #MV._placedGlasses==1 and MV._placedGlasses[1].Parent)
    near(MV.Hum().WalkSpeed,16); frames(m,60); near(MV.Hum().WalkSpeed,16)
end)

test("legacy SpeedMeter shows saved game speed, not our reduced WalkSpeed",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=22; GS.SetValue(7); GS.Set(true)
    local base,source=h.S.SpeedMeter.Detect()
    near(base,22); near(h.S.SpeedMeter.ws,7); assert(source:find("quan sát",1,true))
    GS.Set(false); near(h.S.SpeedMeter.Detect(),22)
end)

local modes={
    {name="camera flight",on=function(MV) return MV.SetFly(true) end,active=function(MV) return MV.fly end},
    {name="safe flight",on=function(MV) return MV.Safe.Set(true) end,active=function(MV) return MV.Safe.on end},
    {name="noclip",on=function(MV) return MV.SetNoclip(true) end,active=function(MV) return MV.noclip end},
    {name="infinite jump",on=function(MV) return MV.SetInfJump(true) end,active=function(MV) return MV.infJump end},
    {name="legacy speed boost",on=function(MV) return MV.SetSpeed(true) end,active=function(MV) return MV.speed end},
    {name="carpet",on=function(MV) return MV.SetCarpet(true) end,active=function(MV) return MV.carpet end},
    {name="run-on-carpet",on=function(MV) return MV.SetRunMode(true) end,active=function(MV) return MV.runMode end},
}
for _,mode in ipairs(modes) do
    test(mode.name.." hands over to ground mode without losing its configuration",function(m,h,GS,MV,E)
        MV.Hum().WalkSpeed=22; MV.Hum().JumpPower=71
        assert(mode.on(MV)); frames(m,3); assert(mode.active(MV))
        GS.SetValue(8); assert(GS.Set(true)); frames(m,30)
        assert(not GS.Conflicting() and GS.on); near(GS.limit,22); near(MV.Hum().WalkSpeed,8)
        near(MV.Hum().JumpPower,71)
        assert(MV.Root().CanCollide and not MV.Hum().PlatformStand and not MV._wd)
        assert(not MV._bv and not MV.Safe._bv and not MV._carpet)
        assert(MV.Safe.auto and MV.Safe.circle and MV.Safe.avoidPlayers and MV.Safe.shield)
        assert(not MV.Flight.hud or not MV.Flight.hud.Visible)
        assert(not MV.Safe._hud or not MV.Safe._hud.Visible)
        assert(not MV._hud or not MV._hud.Visible)
    end)
    test("ground mode yields before "..mode.name.." starts",function(m,h,GS,MV,E)
        MV.Hum().WalkSpeed=22; GS.SetValue(8); GS.Set(true)
        assert(mode.on(MV)); assert(not GS.on and mode.active(MV)); frames(m,3)
        if mode.name=="legacy speed boost" or mode.name=="run-on-carpet" then
            near(MV._baseWS,22); near(MV.Hum().WalkSpeed,66)
        else near(MV.Hum().WalkSpeed,22) end
    end)
end

test("glass travel hands off in both directions and retains placed glass",function(m,h,GS,MV,E)
    MV.PlaceGlass(); MV._placedGlasses[1].Position=E.Vector3.new(100,25,0)
    GS.SetValue(8); GS.Set(true); assert(MV.FlyToGlass(1)); frames(m,3)
    assert(not GS.on and MV._glassFlyActive); near(MV.Hum().WalkSpeed,16)
    assert(GS.Set(true)); frames(m,30)
    assert(not MV._glassFlyActive and not MV._glassFlyBV and not MV.noclip and not m.bindings.BC_GlassFly)
    assert(#MV._placedGlasses==1); near(MV.Hum().WalkSpeed,8)
end)

test("player travel hands off in both directions",function(m,h,GS,MV,E)
    local other=otherPlayer(m,E); GS.SetValue(8); GS.Set(true)
    assert(MV.FlyToPlayer(other)); frames(m,3)
    assert(not GS.on and MV._playerFlyActive); near(MV.Hum().WalkSpeed,16)
    assert(GS.Set(true)); frames(m,30)
    assert(not MV._playerFlyActive and not MV._playerFlyBV and not MV.noclip and not m.bindings.BC_PlayerFly)
    near(MV.Hum().WalkSpeed,8)
end)

test("invalid travel targets never turn off ground movement",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    assert(not MV.FlyToGlass(999)); assert(GS.on); near(MV.Hum().WalkSpeed,8)
    assert(not MV.FlyToPlayer(nil)); assert(GS.on); near(MV.Hum().WalkSpeed,8)
end)

test("turning off already inactive movement tools does not stop ground speed",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    MV.SetFly(false); MV.SetNoclip(false); MV.SetInfJump(false); MV.SetSpeed(false)
    MV.SetCarpet(false); MV.SetRunMode(false)
    assert(GS.on); near(MV.Hum().WalkSpeed,8)
end)

test("non-movement features stay available independently",function(m,h,GS,MV,E)
    local other=otherPlayer(m,E)
    h.S.Glow.Set(true); h.S.Loc.Set(true); h.S.Spec.Set(other)
    GS.SetValue(8); GS.Set(true); frames(m,30)
    assert(GS.on and h.S.Glow.on and h.S.Loc.on and h.S.Spec.on)
    h.S.Spec.Stop(); h.S.Loc.StopAll(); h.S.Glow.Stop()
    assert(GS.on); near(MV.Hum().WalkSpeed,8)
end)

test("missing or dead character cannot enable ground control",function(m,h,GS,MV,E)
    MV.Hum().Health=0; assert(not GS.Set(true) and not GS.on)
    m.player.Character=nil; GS.Sample()
    assert(GS.limit==nil and GS.value==nil and not GS.Set(true))
end)

test("active mode waits across an absent character then reads a fresh lower cap",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=32; GS.SetValue(20); GS.Set(true); local old=MV.Hum()
    m.player.Character=nil; frames(m,15)
    assert(GS.on and GS.limit==nil and GS.observedMax==nil and GS.Status():find("chờ",1,true))
    near(old.WalkSpeed,32)
    local char,root,hum=m:character(); hum.WalkSpeed=10
    m.player.CharacterAdded:Fire(char); frames(m,30)
    assert(GS.on and GS._hum==hum); near(GS.limit,10); near(GS.observedMax,10)
    near(GS.value,10); near(hum.WalkSpeed,10)
    GS.Set(false); near(hum.WalkSpeed,10)
end)

test("direct live-character replacement restores and detaches the old humanoid",function(m,h,GS,MV,E)
    MV.Hum().WalkSpeed=30; GS.SetValue(8); GS.Set(true)
    local old=MV.Hum(); local conn=GS._humConn
    local char,root,hum=m:character(); hum.WalkSpeed=24; frames(m,15)
    assert(GS.on and GS._hum==hum and not conn.Connected)
    near(old.WalkSpeed,30); near(hum.WalkSpeed,8); near(GS.limit,24); near(GS.observedMax,24)
    old.WalkSpeed=99; near(GS.limit,24)
    GS.Set(false); near(hum.WalkSpeed,24)
end)

test("respawn with Humanoid arriving after the character model is handled",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local char=m.new("Model",E.workspace); m.player.Character=char
    m.player.CharacterAdded:Fire(char); frames(m,30); assert(GS.on and GS.limit==nil)
    local root=m.new("Part",char); root.Name="HumanoidRootPart"
    local hum=m.new("Humanoid",char); hum.WalkSpeed=28; frames(m,15)
    assert(GS.on and GS._hum==hum); near(GS.limit,28); near(hum.WalkSpeed,8)
end)

test("death preserves intent without further property writes and respawn re-observes",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); MV.Hum().Health=0
    local writes=m.humanoidWrites.WalkSpeed; frames(m,30)
    assert(GS.on and m.humanoidWrites.WalkSpeed==writes and GS.Status():find("chờ",1,true))
    local char,root,hum=m:character(); hum.WalkSpeed=23; frames(m,15)
    assert(GS.on); near(GS.limit,23); near(hum.WalkSpeed,8)
end)

test("zero on a new character is never overridden during pending auto-resume",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local char,root,hum=m:character(); hum.WalkSpeed=0; frames(m,30)
    near(GS.limit,0); near(GS.value,0); near(hum.WalkSpeed,0)
    hum.WalkSpeed=14; frames(m,15); assert(not GS.on); near(hum.WalkSpeed,14)
end)

test("ground mode can be stopped in a respawn gap without re-enabling later",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); local old=MV.Hum()
    m.player.Character=nil; h.S.groundSpeedControls.stop.Activated:Fire()
    assert(not GS.on); near(old.WalkSpeed,16)
    local char,root,hum=m:character(); hum.WalkSpeed=25; frames(m,30)
    assert(not GS.on); near(hum.WalkSpeed,25)
end)

test("search, category and repeated rebuilds retain panel, input and slider handlers",function(m,h,GS,MV,E)
    local b=show(h); local panel=b.panel
    local changed=m.input.InputChanged:Count(); local ended=m.input.InputEnded:Count()
    for _,category in ipairs({"Di chuyển","Tất cả","Công cụ"}) do
        h.S.hubCat=category; h.S.hubSearch="no-such-script"; h.S.RebuildHubList()
        assert(panel.Parent==h.D.hubList and b.value.Parent==panel)
    end
    h.S.hubCat="Tất cả"; h.S.hubSearch=""; h.S.RebuildHubList()
    assert(m.input.InputChanged:Count()==changed and m.input.InputEnded:Count()==ended)
    assert(h.D.hubList.CanvasSize.Y.Offset>panel.Size.Y.Offset and #h.S.ScriptHubList==32)
    local t=pointer(h,E,"Touch",0.5); b.slider.InputBegan:Fire(t); m.input.InputEnded:Fire(t)
    near(GS.value,8)
end)

test("destroyed panel stops ground speed, releases scroll and disconnects its input",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(8); GS.Set(true)
    local changed=m.input.InputChanged:Count(); local ended=m.input.InputEnded:Count()
    local t=pointer(h,E,"Touch",0.5); b.slider.InputBegan:Fire(t); b.panel:Destroy()
    assert(not GS.on and h.D.hubList.ScrollingEnabled); near(MV.Hum().WalkSpeed,16)
    assert(m.input.InputChanged:Count()==changed-1 and m.input.InputEnded:Count()==ended-1)
    m.input.InputChanged:Fire(t); frames(m,30); near(MV.Hum().WalkSpeed,16)
end)

test("destroying the hub restores owned speed and disconnects its observers",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true)
    local conn,heartbeat=GS._humConn,GS._heartbeat
    h.gui:Destroy(); assert(not GS.on and not conn.Connected and not heartbeat.Connected)
    near(MV.Hum().WalkSpeed,16); MV.Hum().WalkSpeed=25; frames(m,30); near(MV.Hum().WalkSpeed,25)
end)

test("unparented hub also restores speed instead of silently retaining the override",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); h.gui.Parent=nil; frames(m,15)
    assert(not GS.on and not GS._heartbeat and not GS._humConn); near(MV.Hum().WalkSpeed,16)
end)

test("repeated reload restores speed without leaking input or property observers",function(m,h,GS,MV,E)
    local baseChanged=m.input.InputChanged:Count(); local baseEnded=m.input.InputEnded:Count()
    local baseHeartbeat=m.run.Heartbeat:Count(); local hum=MV.Hum()
    local baseProperty=hum:GetPropertyChangedSignal("WalkSpeed"):Count()
    for i=1,3 do
        local current=h.S.GroundSpeed; current.SetValue(8); current.Set(true)
        local conn=current._humConn
        h=m:load(hubSource); m:advance(0.05)
        assert(not current.on and not conn.Connected)
        near(hum.WalkSpeed,16); near(h.S.GroundSpeed.gameSpeed,16)
        assert(m.input.InputChanged:Count()==baseChanged and m.input.InputEnded:Count()==baseEnded)
        assert(m.run.Heartbeat:Count()==baseHeartbeat and hum:GetPropertyChangedSignal("WalkSpeed"):Count()==baseProperty)
        assert(not h.S.GroundSpeed.on and m:count("HubGroundSpeed_Panel")==1)
    end
end)

test("pending old respawn callback cannot reconnect a closed ground controller",function(m,h,GS,MV,E)
    local oldHum=MV.Hum(); local char=m.player.Character
    m.player.CharacterAdded:Fire(char) -- old delayed MV.Refresh has not run yet
    h.gui:Destroy()
    local nextChar,root,hum=m:character(); hum.WalkSpeed=24
    m:advance(0.5); frames(m,15)
    assert(GS._humConn==nil and GS._heartbeat==nil and not GS.on)
    near(hum.WalkSpeed,24)
end)


test("old character speed events cannot cancel intent after Character already changed",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); local old=MV.Hum()
    local char,root,hum=m:character(); hum.WalkSpeed=24
    old.WalkSpeed=0 -- a late death/reset event, before the 5 Hz observer runs
    frames(m,15)
    assert(GS.on and GS._hum==hum); near(GS.limit,24); near(hum.WalkSpeed,8)
    near(old.WalkSpeed,0)
end)

test("deferred old-character correction cannot be mistaken for the new game's cap",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); local old=MV.Hum(); m.deferPropertySignals=true
    old.WalkSpeed=0
    local char,root,hum=m:character(); hum.WalkSpeed=24
    m:advance(0.01); frames(m,15)
    assert(GS.on and GS._hum==hum); near(GS.limit,24); near(hum.WalkSpeed,8)
    near(old.WalkSpeed,0)
end)

for _,bad in ipairs({0,0/0}) do
    test("invalid ground cap does not first disable an active flight: "..tostring(bad),function(m,h,GS,MV,E)
        MV.SetFly(true); MV.Hum().WalkSpeed=bad
        local ok,err=GS.Set(true)
        assert(not ok and err and not GS.on and MV.fly and MV._bv)
    end)
end

test("closed controller cannot be explicitly reactivated through stale references",function(m,h,GS,MV,E)
    GS.SetValue(8); GS.Set(true); h.gui:Destroy()
    assert(not GS.Set(true) and not GS.on and GS._humConn==nil and GS._heartbeat==nil)
    near(MV.Hum().WalkSpeed,16)
end)

print(string.format("\n%d passed / %d failed — ground-speed callbacks/state only; no Roblox physics or ban-safety verification.",passed,failed))
assert(failed==0,"ground speed regression tests failed")
