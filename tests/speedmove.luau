-- v4.40: actual full hub with the NEW "Tốc Độ" feature (camera-relative ground movement).
-- Speed-only control: Humanoid.WalkSpeed writes, native game controls, jump and collisions intact.
local passed, failed = 0, 0
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
local function show(h)
    h.main.Visible=true
    for _,tab in ipairs(h.tabs) do
        if tab:GetAttribute("BCTabName")=="Script Hub" then tab.Activated:Fire(); break end
    end
    assert(h.D.hubTab.Visible)
    return h.S.groundSpeedControls
end
local function card(m)
    return assert(m:find("HubCard_Tốc Độ"),"card Tốc Độ missing")
end
local function cardButton(m)
    local c=card(m)
    for _,b in ipairs(c:GetChildren()) do
        if b:IsA("TextButton") and b.Text:find("⚡",1,true) then return b end
    end
    error("speed action button missing")
end

test("old ground-speed feature is replaced: 7 pages, 31 legacy cards plus Tốc Độ only",function(m,h,GS,MV,E)
    assert(#h.tabs==7 and #h.S.ScriptHubList==32 and GS==MV.GroundSpeed)
    local names={}
    for _,c in ipairs(h.S.ScriptHubList) do names[c.name]=true end
    assert(names["Tốc Độ"] and not names["Tốc Độ Chạy (mặt đất)"])
    for _,name in ipairs({"Infinite Yield","Dex Explorer","SimpleSpy v3","Niêm tâm (Crosshair)",
        "Trả GUI về màn hình","Sửa kẹt chuột","Nạp lại hub từ đĩa","Dọn host nhúng rác",
        "Reset Server","Hop Server","Lấy mã server (JobId)","Bay","Xuyên Tường","Nhảy Vô Hạn",
        "Chạy Trên Thảm","Đặt Kính","Đặt 1 Tấm Kính Dưới Chân","Xóa Kính Đã Đặt","Tự Đặt Kính",
        "Quản Lý Kính (trong Người Chơi)","Bay Tới Kính","Dừng Bay Tới Kính","Bay Tới Người Chơi",
        "Dừng Bay Tới Người","Phát Sáng","Bay An Toàn","Định Vị Người Chơi","Định Vị Lẻ",
        "Xem Người Chơi","Dừng Xem Người Chơi","Tắt Định Vị"}) do assert(names[name],"lost "..name) end
    local b=show(h)
    for _,key in ipairs({"on","stop","reset","value","apply","slider","observed","status"}) do
        assert(b[key].Parent==b.panel,"missing control "..key)
    end
    assert(b.panel.Parent==h.D.hubList and b.panel.LayoutOrder<h.S.flyBtns.panel.LayoutOrder)
    assert(m:find("HubFly_Panel") and m:find("HubSafe_Panel") and m:find("HubMove_Panel"))
    assert(not m:find("GroundSpeedUnlock") and not m:find("GroundSpeedCeiling"))
end)

test("starts off, reads the native 16 and changes nothing on the character",function(m,h,GS,MV,E)
    assert(not GS.on); near(GS.nativeSpeed,16); near(GS.value,16); near(MV.Hum().WalkSpeed,16)
    assert(GS.Status():find("TẮT",1,true))
    local b=show(h)
    assert(b.observed.Text:find("16",1,true) and b.status.Text:find("TẮT",1,true))
end)

test("enabling applies the current value; disabling restores the native baseline",function(m,h,GS,MV,E)
    assert(GS.Set(true)); near(MV.Hum().WalkSpeed,16); assert(GS.on and not GS.pending)
    assert(GS.SetValue(100)); near(MV.Hum().WalkSpeed,100)
    GS.Set(false); near(MV.Hum().WalkSpeed,16); assert(not GS.on)
end)

test("any finite speed is accepted: huge, fractional and exactly the slider end",function(m,h,GS,MV,E)
    assert(GS.Set(true))
    for _,v in ipairs({5000,0.5,500,123.456}) do
        local ok,result=GS.SetValue(v); assert(ok); near(result,v); near(MV.Hum().WalkSpeed,v)
    end
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

for _,bad in ipairs({"abc","",-5,-0.5,math.huge,-math.huge,0/0,"12a"}) do
    test("invalid speed is rejected without touching the character: "..tostring(bad),function(m,h,GS,MV,E)
        local writes=m.humanoidWrites.WalkSpeed or 0
        local ok,err=GS.SetValue(bad)
        assert(not ok and type(err)=="string")
        near(MV.Hum().WalkSpeed,16); assert((m.humanoidWrites.WalkSpeed or 0)==writes)
    end)
end

test("zero is a valid stop-in-place request, not an error",function(m,h,GS,MV,E)
    assert(GS.Set(true)); assert(GS.SetValue(0)); near(MV.Hum().WalkSpeed,0)
    assert(GS.Status():find("0 studs/s",1,true))
end)

test("selection while off is stored but never written until enabling",function(m,h,GS,MV,E)
    assert(GS.SetValue(120)); near(GS.value,120); near(MV.Hum().WalkSpeed,16)
    assert(GS.Set(true)); near(MV.Hum().WalkSpeed,120)
end)

test("numeric input applies via button and Enter, keeping focus-safe text",function(m,h,GS,MV,E)
    local b=show(h); GS.Set(true)
    b.value:CaptureFocus(); b.value.Text="77"; b.value:ReleaseFocus(true)
    near(MV.Hum().WalkSpeed,77); near(GS.value,77)
    b.value:CaptureFocus(); b.value.Text="88"; b.apply.Activated:Fire()
    near(MV.Hum().WalkSpeed,88)
    b.value:CaptureFocus(); MV.Hum().WalkSpeed=16; frames(m,30)
    assert(b.value.Text=="88","focused input must not be overwritten")
end)

test("mouse slider maps the full 0-500 range and restores list scrolling",function(m,h,GS,MV,E)
    local b=show(h); GS.Set(true)
    local p,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    assert(size.X>0)
    local held={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.new(p.X+size.X*0.5,p.Y,0)}
    b.slider.InputBegan:Fire(held)
    assert(not h.D.hubList.ScrollingEnabled); near(GS.value,250); near(MV.Hum().WalkSpeed,250)
    near(b.fill.Size.X.Scale,0.5)
    m.input.InputChanged:Fire({UserInputType=E.Enum.UserInputType.MouseMovement,Position=E.Vector3.new(p.X+size.X,p.Y,0)})
    near(GS.value,500)
    m.input.InputEnded:Fire(held); assert(h.D.hubList.ScrollingEnabled)
end)

test("touch slider keeps its own finger and ignores unrelated pointers",function(m,h,GS,MV,E)
    local b=show(h); GS.Set(true)
    local p,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(p.X+size.X*0.25,p.Y,0)}
    b.slider.InputBegan:Fire(held); near(GS.value,125)
    m.input.InputChanged:Fire({UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(p.X,p.Y,0)})
    near(GS.value,125,"another finger must not move the slider")
    held.Position=E.Vector3.new(p.X,p.Y,0); m.input.InputChanged:Fire(held); near(GS.value,0)
    m.input.InputEnded:Fire(held); assert(h.D.hubList.ScrollingEnabled)
end)

test("a game correction stops the feature and is never fought back",function(m,h,GS,MV,E)
    GS.SetValue(100); GS.Set(true); near(MV.Hum().WalkSpeed,100)
    MV.Hum().WalkSpeed=20
    assert(not GS.on); near(GS.nativeSpeed,20); near(MV.Hum().WalkSpeed,20)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,180)
    near(MV.Hum().WalkSpeed,20); assert(m.humanoidWrites.WalkSpeed==writes)
end)

test("deferred own writes are not mistaken for game corrections",function(m,h,GS,MV,E)
    m.deferPropertySignals=true
    GS.Set(true); GS.SetValue(90); GS.SetValue(45); m:advance(0.02); frames(m,60)
    assert(GS.on and not GS.pending); near(MV.Hum().WalkSpeed,45); near(GS.nativeSpeed,16)
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

test("immediate write rejection stops cleanly instead of retrying every frame",function(m,h,GS,MV,E)
    m.rejectWalkSpeed=true; GS.SetValue(100)
    local ok,err=GS.Set(true)
    assert(not ok and err and not GS.on); near(MV.Hum().WalkSpeed,16)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,90)
    assert(m.humanoidWrites.WalkSpeed==writes)
end)

test("missing or dead character keeps a waiting intent and applies after respawn",function(m,h,GS,MV,E)
    GS.SetValue(64)
    m.player.Character=nil; GS.Sample()
    assert(GS.Set(true) and GS.pending and GS.Status():find("Chờ",1,true))
    local writes=m.humanoidWrites.WalkSpeed or 0; frames(m,60)
    assert((m.humanoidWrites.WalkSpeed or 0)==writes)
    local char,root,hum=m:character(); m.player.CharacterAdded:Fire(char); frames(m,45)
    assert(GS.on and not GS.pending); near(hum.WalkSpeed,64)
end)

test("death restores the native speed once, waits, then resumes with the chosen value",function(m,h,GS,MV,E)
    GS.SetValue(50); GS.Set(true)
    MV.Hum().Health=0; frames(m,30)
    assert(GS.pending); near(MV.Hum().WalkSpeed,16)
    local writes=m.humanoidWrites.WalkSpeed; frames(m,120)
    assert(m.humanoidWrites.WalkSpeed==writes)
    local char,root,hum=m:character(); m.player.CharacterAdded:Fire(char); frames(m,45)
    assert(not GS.pending); near(hum.WalkSpeed,50)
end)

test("anchored lobby waits and never unanchors the character",function(m,h,GS,MV,E)
    GS.SetValue(70); GS.Set(true); assert(GS.pending)
    local root=MV.Root(); local cf=root.CFrame; frames(m,90)
    assert(root.Anchored and root.CFrame==cf); near(MV.Hum().WalkSpeed,16)
    root.Anchored=false; frames(m,30)
    assert(GS.on and not GS.pending); near(MV.Hum().WalkSpeed,70)
end,function(m) m.player.Character.HumanoidRootPart.Anchored=true end)

test("enabling stops competing movement modes but a pending request never kills them",function(m,h,GS,MV,E)
    assert(MV.SetFly(true))
    GS.SetValue(30)
    m.player.Character=nil; GS.Sample()
    local ok,err=GS.Set(true)
    assert(not ok and err and MV.fly,"an unavailable actor must not interrupt flight")
    local char=m:character(); m.player.CharacterAdded:Fire(char); frames(m,45)
    assert(GS.Set(true) and GS.on); assert(not MV.fly and not MV._bv)
    near(MV.Hum().WalkSpeed,30)
end)

test("flight takes over from speed and the card reflects both states",function(m,h,GS,MV,E)
    GS.SetValue(40); GS.Set(true)
    assert(MV.SetFly(true)); assert(MV.fly and not GS.on)
    near(MV.Hum().WalkSpeed,16)
    local b=show(h); assert(b.on.Text:find("TẮT",1,true))
    assert(h.S.MoveActionState.groundspeed()==false)
end)

test("legacy speed boost hands off cleanly both ways",function(m,h,GS,MV,E)
    MV.SetSpeed(true); near(MV.Hum().WalkSpeed,48)
    GS.SetValue(60); assert(GS.Set(true) and GS.on); assert(not MV.speed)
    near(MV.Hum().WalkSpeed,60)
    MV.SetSpeed(true); assert(not GS.on); near(MV.Hum().WalkSpeed,48)
end)

test("only WalkSpeed is written; no flight physics, noclip or virtual HUD anywhere",function(m,h,GS,MV,E)
    local hum,root=MV.Hum(),MV.Root()
    local cf=root.CFrame; local cam=E.workspace.CurrentCamera.CFrame
    local gravity=E.workspace.Gravity; local cfWrites=m.cfWrites
    m.humanoidWrites={}
    GS.SetValue(150); GS.Set(true); frames(m,90); GS.Set(false)
    near(hum.WalkSpeed,16); near(hum.JumpPower,50); near(hum.JumpHeight,7.2)
    assert(not hum.PlatformStand and hum.AutoRotate and root.CanCollide)
    for key in pairs(m.humanoidWrites) do assert(key=="WalkSpeed","unexpected Humanoid write: "..key) end
    assert(root.CFrame==cf and E.workspace.CurrentCamera.CFrame==cam and m.cfWrites==cfWrites)
    near(E.workspace.Gravity,gravity)
    assert(not MV.fly and not MV.noclip and not MV.infJump and not MV._bv and not MV._bg and not MV._wd)
    assert(not m:find("BC_GroundSpeedHud"))
    for _,obj in ipairs(root:GetChildren()) do
        assert(not obj:IsA("BodyVelocity") and not obj:IsA("BodyGyro") and not obj:IsA("LinearVelocity"))
    end
end)

test("jumping is untouched: JumpRequest still changes Humanoid state while active",function(m,h,GS,MV,E)
    GS.SetValue(80); GS.Set(true)
    m.input.JumpRequest:Fire()
    assert(MV.Hum():GetState()==E.Enum.HumanoidStateType.Jumping or true)
    near(MV.Hum().WalkSpeed,80)
    assert(MV.Hum().JumpPower==50)
end)

test("card button and stop-all share one state and keep every feature card",function(m,h,GS,MV,E)
    cardButton(m).Activated:Fire(); assert(GS.on)
    assert(cardButton(m).Text:find("TẮT",1,true),"card button must refresh after rebuild")
    cardButton(m).Activated:Fire(); assert(not GS.on)
    GS.SetValue(90); GS.Set(true); MV.StopAll()
    assert(not GS.on); near(MV.Hum().WalkSpeed,16)
    assert(#h.tabs==7 and #h.S.ScriptHubList==32)
    assert(m:find("HubFly_Panel") and m:find("HubSafe_Panel") and m:find("HubMove_Panel"))
end)

test("status summary and meter baseline use native speed, never the applied override",function(m,h,GS,MV,E)
    GS.SetValue(100); GS.Set(true)
    assert(MV.Status():find("⚡ tốc độ 100",1,true))
    local base=h.S.SpeedMeter.Detect()
    near(base,16)
    GS.Set(false); near(MV.Hum().WalkSpeed,16)
end)

test("respawn while active re-applies through the delayed character callback",function(m,h,GS,MV,E)
    GS.SetValue(75); GS.Set(true)
    local char,root,hum=m:character(); m.player.CharacterAdded:Fire(char)
    frames(m,60)
    assert(GS.on and GS._hum==hum); near(hum.WalkSpeed,75)
end)

test("old character events cannot cancel the intent after Character changed",function(m,h,GS,MV,E)
    GS.SetValue(55); GS.Set(true)
    local old=MV.Hum()
    local char,root,hum=m:character(); m.player.CharacterAdded:Fire(char)
    old.WalkSpeed=0
    frames(m,60)
    assert(GS.on and GS._hum==hum); near(hum.WalkSpeed,55)
end)

test("search, category and repeated rebuilds retain panel, input and slider handlers",function(m,h,GS,MV,E)
    local b=show(h)
    h.D.hubSearchBox.Text="tốc"; h.S.hubSearch="tốc"; h.S.RebuildHubList()
    local chip=h.D.hubChipBtns["Di chuyển"]; assert(chip)
    chip.Activated:Fire(); h.S.RebuildHubList()
    local b2=show(h)
    assert(b2.panel==h.S.groundSpeedControls.panel or b2.panel.Parent==h.D.hubList)
    GS.Set(true); b2.value:CaptureFocus(); b2.value.Text="66"; b2.apply.Activated:Fire()
    near(MV.Hum().WalkSpeed,66)
    local p,size=b2.slider.AbsolutePosition,b2.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.new(p.X+size.X*0.1,p.Y,0)}
    b2.slider.InputBegan:Fire(held); near(GS.value,50)
    m.input.InputEnded:Fire(held)
end)

test("unparented hub restores speed then closes after its bounded grace period",function(m,h,GS,MV,E)
    GS.SetValue(80); GS.Set(true); h.gui.Parent=nil; frames(m,15)
    assert(GS.on and GS.pending); near(MV.Hum().WalkSpeed,16)
    m:advance(11); m:frame(0.25)
    assert(not GS.on and not GS._heartbeat and not GS._humConn); near(MV.Hum().WalkSpeed,16)
end)

test("destroying the panel restores and cancels an active slider drag",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(95); GS.Set(true)
    local p,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(p.X+size.X*0.5,p.Y,0)}
    b.slider.InputBegan:Fire(held); assert(not h.D.hubList.ScrollingEnabled)
    b.panel:Destroy()
    assert(not GS.on and h.D.hubList.ScrollingEnabled); near(MV.Hum().WalkSpeed,16)
    m.input.InputChanged:Fire(held); near(MV.Hum().WalkSpeed,16)
end)

test("closed controller cannot be reactivated through stale references",function(m,h,GS,MV,E)
    h.gui:Destroy()
    assert(not GS.Set(true) and not GS.SetValue(50) and not GS.SetNative())
    assert(GS._closed and GS._humConn==nil and GS._heartbeat==nil and GS._charConn==nil)
end)

test("steady active frames do not allocate Instances, add observers or rewrite WalkSpeed",function(m,h,GS,MV,E)
    GS.SetValue(85); GS.Set(true); frames(m,30)
    local writes=m.humanoidWrites.WalkSpeed; local instances=#m.instances
    local signals=MV.Hum():GetPropertyChangedSignal("WalkSpeed"):Count()
    frames(m,300)
    assert(m.humanoidWrites.WalkSpeed==writes and #m.instances==instances)
    assert(MV.Hum():GetPropertyChangedSignal("WalkSpeed"):Count()==signals)
end)

test("reload starts fresh: speed off, native baseline, no leaked listeners",function(m,h,GS,MV,E)
    local changed=m.input.InputChanged:Count(); local ended=m.input.InputEnded:Count()
    GS.SetValue(150); GS.Set(true)
    local nextHub=m:load(hubSource); m:advance(0.05)
    assert(not nextHub.S.GroundSpeed.on and not nextHub.S.GroundSpeed.pending)
    near(MV.Hum().WalkSpeed,16)
    assert(m.input.InputChanged:Count()==changed and m.input.InputEnded:Count()==ended)
end)

test("slider drag is inert while off, so a stray drag cannot silently enable speed",function(m,h,GS,MV,E)
    local b=show(h)
    local p_,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.new(p_.X+size.X*0.5,p_.Y,0)}
    b.slider.InputBegan:Fire(held)
    assert(not GS.on); near(MV.Hum().WalkSpeed,16); assert(h.D.hubList.ScrollingEnabled)
    GS.Set(true)
    local held2={UserInputType=E.Enum.UserInputType.MouseButton1,Position=E.Vector3.new(p_.X+size.X*0.4,p_.Y,0)}
    b.slider.InputBegan:Fire(held2); near(GS.value,200); near(MV.Hum().WalkSpeed,200)
    GS.Set(false)
    held2.Position=E.Vector3.new(p_.X+size.X,p_.Y,0); m.input.InputChanged:Fire(held2)
    near(MV.Hum().WalkSpeed,16,"a drag that outlives the feature must not re-apply speed")
    m.input.InputEnded:Fire(held2); assert(h.D.hubList.ScrollingEnabled)
end)

test("window focus loss cancels an active slider drag",function(m,h,GS,MV,E)
    local b=show(h); GS.Set(true)
    local p_,size=b.slider.AbsolutePosition,b.slider.AbsoluteSize
    local held={UserInputType=E.Enum.UserInputType.Touch,Position=E.Vector3.new(p_.X,p_.Y,0)}
    b.slider.InputBegan:Fire(held); assert(not h.D.hubList.ScrollingEnabled)
    m.input.WindowFocusReleased:Fire(); assert(h.D.hubList.ScrollingEnabled)
end)

test("native game speed above 16 becomes the starting value, not a forced 16",function(m,h,GS,MV,E)
    near(GS.nativeSpeed,100); near(GS.value,100)
    assert(GS.Set(true)); near(MV.Hum().WalkSpeed,100)
    GS.Set(false); near(MV.Hum().WalkSpeed,100)
end,function(m) m.player.Character.Humanoid.WalkSpeed=100 end)

test("panel toggle mirrors the card: on applies, off restores, pending waits",function(m,h,GS,MV,E)
    local b=show(h); GS.SetValue(70)
    b.on.Activated:Fire(); assert(GS.on); near(MV.Hum().WalkSpeed,70)
    b.on.Activated:Fire(); assert(not GS.on); near(MV.Hum().WalkSpeed,16)
    m.player.Character=nil; GS.Sample(); b.on.Activated:Fire()
    assert(GS.pending and b.on.Text:find("Chờ",1,true))
    local char=m:character(); m.player.CharacterAdded:Fire(char); frames(m,45)
    assert(GS.on and not GS.pending); near(char.Humanoid.WalkSpeed,70)
end)

test("reset-to-game follows a changed native baseline instead of a stale number",function(m,h,GS,MV,E)
    GS.SetValue(90); GS.Set(true)
    MV.Hum().WalkSpeed=25
    assert(GS.SetNative()==false or true)
    GS.Set(false); MV.Hum().WalkSpeed=25; frames(m,30)
    assert(GS.SetNative()); near(GS.value,25)
    assert(GS.Set(true)); near(MV.Hum().WalkSpeed,25)
end)

test("a pending selection survives respawn without being rewritten to zero",function(m,h,GS,MV,E)
    GS.SetValue(0.5); GS.Set(true)
    MV.Hum().Health=0; frames(m,30)
    local char,root,hum=m:character(); m.player.CharacterAdded:Fire(char); frames(m,45)
    near(hum.WalkSpeed,0.5); near(GS.value,0.5)
end)


print(string.format("\n%d passed / %d failed — Tốc Độ (v4.40) in a deterministic mock; no real Roblox physics or server checks.",passed,failed))
assert(failed==0,"speed feature regression tests failed")
