-- Deterministic test double, NOT a physics engine / Roblox integration test.
-- Important contracts: immediate task.spawn, real vector/camera math, distinct
-- touch identities, named render bindings, instance destruction and Text typing.
return function()
    local m = {now = 1, errors = {}, warnings = {}, propertyErrors = {}, instances = {}, scheduled = {}, keys = {}, bindings = {}, cfWrites = 0, httpCalls = 0}
    local env = setmetatable({_G = {}}, {__index = getfenv()})
    m.env = env

    local function signal()
        local sig = {listeners = {}}
        function sig:Connect(fn)
            local conn = {Connected = true, fn = fn}
            function conn:Disconnect() self.Connected = false end
            self.listeners[#self.listeners + 1] = conn
            return conn
        end
        function sig:Fire(...)
            local listeners = table.clone(self.listeners)
            for _, c in ipairs(listeners) do
                if c.Connected then
                    local ok, err = pcall(c.fn, ...)
                    if not ok then m.errors[#m.errors + 1] = tostring(err) end
                end
            end
        end
        function sig:DisconnectAll() for _, c in ipairs(self.listeners) do c:Disconnect() end end
        function sig:Count()
            local n = 0
            for _, c in ipairs(self.listeners) do if c.Connected then n += 1 end end
            return n
        end
        return sig
    end
    m.signal = signal

    local V = {}
    local vmt = {}
    function V.new(x, y, z) return setmetatable({X=x or 0, Y=y or 0, Z=z or 0, _type="Vector3"}, vmt) end
    function vmt.__index(v, key)
        if key == "Magnitude" then return math.sqrt(v.X*v.X + v.Y*v.Y + v.Z*v.Z) end
        if key == "Unit" then return v / v.Magnitude end
        if key == "Dot" then return function(a,b) return a.X*b.X + a.Y*b.Y + a.Z*b.Z end end
        if key == "Cross" then return function(a,b) return V.new(a.Y*b.Z-a.Z*b.Y, a.Z*b.X-a.X*b.Z, a.X*b.Y-a.Y*b.X) end end
        if key == "Lerp" then return function(a,b,t) return a + (b-a)*t end end
    end
    function vmt.__add(a,b) return V.new(a.X+b.X, a.Y+b.Y, a.Z+b.Z) end
    function vmt.__sub(a,b) return V.new(a.X-b.X, a.Y-b.Y, a.Z-b.Z) end
    function vmt.__unm(a) return V.new(-a.X,-a.Y,-a.Z) end
    function vmt.__mul(a,b)
        if type(a) == "number" then return V.new(a*b.X,a*b.Y,a*b.Z) end
        return V.new(a.X*b,a.Y*b,a.Z*b)
    end
    function vmt.__div(a,b) return V.new(a.X/b,a.Y/b,a.Z/b) end
    function vmt.__eq(a,b) return a.X==b.X and a.Y==b.Y and a.Z==b.Z end
    function vmt.__tostring(v) return string.format("(%g,%g,%g)",v.X,v.Y,v.Z) end
    V.zero = V.new()
    env.Vector3 = V
    env.Vector2 = {new = function(x,y) local v=V.new(x,y); v._type="Vector2"; return v end}

    local CF = {}
    local cfmt = {}
    local function cf(pos, right, up, look)
        return setmetatable({Position=pos, RightVector=right, UpVector=up, LookVector=look, _type="CFrame"}, cfmt)
    end
    function CF.new(x,y,z)
        if type(x) == "table" then
            if type(y) == "table" then return CF.lookAt(x,y) end
            return cf(x,V.new(1,0,0),V.new(0,1,0),V.new(0,0,-1))
        end
        return cf(V.new(x,y,z),V.new(1,0,0),V.new(0,1,0),V.new(0,0,-1))
    end
    function CF.lookAt(pos,target)
        local look=(target-pos).Unit
        local reference=math.abs(look.Y)>0.9999 and V.new(0,0,1) or V.new(0,1,0)
        local right=look:Cross(reference).Unit
        return cf(pos,right,right:Cross(look).Unit,look)
    end
    function CF.Angles(x,y,z)
        local cx,sx,cy,sy,cz,sz=math.cos(x),math.sin(x),math.cos(y),math.sin(y),math.cos(z),math.sin(z)
        return cf(V.zero, V.new(cy*cz,cx*sz+sx*sy*cz,sx*sz-cx*sy*cz),
            V.new(-cy*sz,cx*cz-sx*sy*sz,sx*cz+cx*sy*sz), V.new(-sy,sx*cy,-cx*cy))
    end
    function cfmt.__index(c,key)
        if key == "Rotation" then return cf(V.zero,c.RightVector,c.UpVector,c.LookVector) end
        if key == "p" then return c.Position end
        if key == "X" or key == "Y" or key == "Z" then return c.Position[key] end
        if key == "VectorToWorldSpace" then return function(a,v) return a.RightVector*v.X + a.UpVector*v.Y - a.LookVector*v.Z end end
        if key == "VectorToObjectSpace" then return function(a,v) return V.new(v:Dot(a.RightVector),v:Dot(a.UpVector),-v:Dot(a.LookVector)) end end
        if key == "ToOrientation" then return function() return 0,0,0 end end
        if key == "Lerp" then return function(a,b,t) return cf(a.Position:Lerp(b.Position,t),b.RightVector,b.UpVector,b.LookVector) end end
    end
    function cfmt.__mul(a,b)
        if b._type=="Vector3" then return a.Position+a:VectorToWorldSpace(b) end
        return cf(a.Position+a:VectorToWorldSpace(b.Position),a:VectorToWorldSpace(b.RightVector),a:VectorToWorldSpace(b.UpVector),a:VectorToWorldSpace(b.LookVector))
    end
    function cfmt.__add(a,b) return cf(a.Position+b,a.RightVector,a.UpVector,a.LookVector) end
    function cfmt.__sub(a,b) return cf(a.Position-b,a.RightVector,a.UpVector,a.LookVector) end
    env.CFrame=CF
    env.UDim={new=function(s,o) return {Scale=s or 0,Offset=o or 0,_type="UDim"} end}
    env.UDim2={new=function(xs,xo,ys,yo) return {X=env.UDim.new(xs,xo),Y=env.UDim.new(ys,yo),_type="UDim2"} end}
    env.UDim2.fromScale=function(x,y) return env.UDim2.new(x,0,y,0) end
    env.Color3={new=function(r,g,b) return {R=r or 0,G=g or 0,B=b or 0,_type="Color3"} end}
    env.Color3.fromRGB=function(r,g,b) return env.Color3.new(r/255,g/255,b/255) end
    for _,name in ipairs({"Font","TweenInfo","ColorSequence","ColorSequenceKeypoint","NumberSequence","NumberSequenceKeypoint","RaycastParams","OverlapParams"}) do
        env[name]={new=function(...) return {...} end}
    end
    env.Enum=setmetatable({}, {__index=function(t,group)
        local g=setmetatable({}, {__index=function(items,name)
            local item=setmetatable({Name=name,Value=group=="RenderPriority" and (name=="Camera" and 200 or 2000) or 0},
                {__tostring=function() return "Enum."..group.."."..name end})
            rawset(items,name,item); return item
        end})
        rawset(t,group,g); return g
    end})
    env.typeof=function(v) return type(v)=="table" and (v._type or (rawget(v,"_props") and "Instance")) or type(v) end

    local methods, instmt = {}, {}
    local guiClasses={Frame=true,ScrollingFrame=true,TextButton=true,TextLabel=true,TextBox=true,ImageLabel=true,ImageButton=true}
    local partClasses={Part=true,MeshPart=true,WedgePart=true}
    local eventNames={ChildAdded=true,ChildRemoved=true,DescendantAdded=true,AncestryChanged=true,Destroying=true,
        Activated=true,InputBegan=true,InputEnded=true,InputChanged=true,MouseEnter=true,MouseLeave=true,
        MouseButton1Down=true,MouseButton1Up=true,Focused=true,FocusLost=true,CharacterAdded=true,CharacterRemoving=true}
    function methods:IsA(cls)
        return self.ClassName==cls or cls=="Instance" or (cls=="BasePart" and partClasses[self.ClassName]==true)
            or (cls=="GuiObject" and guiClasses[self.ClassName]==true) or (cls=="GuiButton" and (self.ClassName=="TextButton" or self.ClassName=="ImageButton"))
    end
    function methods:GetChildren() return table.clone(self._children) end
    function methods:GetDescendants()
        local out={}
        local function scan(obj) for _,c in ipairs(obj._children) do out[#out+1]=c; scan(c) end end
        scan(self); return out
    end
    function methods:FindFirstChild(name,recursive)
        for _,c in ipairs(self._children) do if c.Name==name then return c end end
        if recursive then for _,c in ipairs(self:GetDescendants()) do if c.Name==name then return c end end end
    end
    function methods:FindFirstChildOfClass(cls) for _,c in ipairs(self._children) do if c.ClassName==cls then return c end end end
    methods.FindFirstChildWhichIsA=methods.FindFirstChildOfClass
    function methods:WaitForChild(name) return assert(self:FindFirstChild(name),"missing mock child "..name) end
    function methods:FindFirstAncestorOfClass(cls)
        local a=self.Parent
        while a do if a.ClassName==cls then return a end; a=a.Parent end
    end
    function methods:IsDescendantOf(other)
        local a=self.Parent
        while a do if a==other then return true end; a=a.Parent end
        return false
    end
    function methods:GetPropertyChangedSignal(key)
        local k="Property_"..key
        self._signals[k]=self._signals[k] or signal(); return self._signals[k]
    end
    function methods:SetAttribute(k,v) self._attributes[k]=v end
    function methods:GetAttribute(k) return self._attributes[k] end
    function methods:ClearAllChildren() for _,c in ipairs(self:GetChildren()) do c:Destroy() end end
    function methods:Destroy()
        if self._destroyed then return end
        self.Destroying:Fire()
        self:ClearAllChildren()
        self.Parent=nil
        self._destroyed=true
        for _,sig in pairs(self._signals) do sig:DisconnectAll() end
    end
    function methods:ReleaseFocus(enter)
        if m.focused==self then m.focused=nil; self.FocusLost:Fire(enter==true) end
    end
    function methods:CaptureFocus() m.focused=self; self.Focused:Fire() end
    function methods:IsFocused() return m.focused==self end
    function methods:GetState() return env.Enum.HumanoidStateType.Running end
    function methods:ChangeState(state) self._props.State=state end
    function methods:GetStateEnabled() return true end
    function methods:SetStateEnabled() end
    function methods:GetBoundingBox() return self.PrimaryPart and self.PrimaryPart.CFrame or CF.new(),V.new(4,6,2) end
    function methods:GetExtentsSize() return V.new(4,6,2) end
    function instmt.__index(obj,key)
        if methods[key] then return methods[key] end
        if eventNames[key] then obj._signals[key]=obj._signals[key] or signal(); return obj._signals[key] end
        if key=="AbsoluteSize" then
            local size=obj._props.Size
            if not size or not size.X or type(size.X)~="table" then return V.new(1280,720) end
            local parent=obj.Parent and obj.Parent.AbsoluteSize or V.new(1280,720)
            return V.new(parent.X*size.X.Scale+size.X.Offset,parent.Y*size.Y.Scale+size.Y.Offset)
        end
        if key=="AbsolutePosition" then
            local pos=obj._props.Position
            if not pos or not pos.X or type(pos.X)~="table" then return V.zero end
            local parent=obj.Parent
            local ps=parent and parent.AbsoluteSize or V.new(1280,720)
            local pp=parent and parent.AbsolutePosition or V.zero
            return pp+V.new(ps.X*pos.X.Scale+pos.X.Offset,ps.Y*pos.Y.Scale+pos.Y.Offset)
        end
        if key=="AbsoluteContentSize" then return V.new(400,300) end
        local value=obj._props[key]
        if value~=nil then return value end
        return methods.FindFirstChild(obj,key)
    end
    function instmt.__newindex(obj,key,value)
        if key:sub(1,1)=="_" then rawset(obj,key,value); return end
        if key=="Text" and type(value)~="string" then
            local err="Text must be string on "..obj.Name..", got "..type(value)
            m.propertyErrors[#m.propertyErrors+1]=err; error(err)
        end
        local old=obj._props[key]
        if key=="Parent" and old~=value then
            assert(not obj._destroyed or value==nil,"cannot reparent destroyed instance")
            if old then
                local idx=table.find(old._children,obj); if idx then table.remove(old._children,idx) end
                old.ChildRemoved:Fire(obj)
            end
            obj._props.Parent=value
            if value then
                value._children[#value._children+1]=obj
                value.ChildAdded:Fire(obj)
                local p=value
                while p do p.DescendantAdded:Fire(obj); p=p.Parent end
            end
            obj.AncestryChanged:Fire(obj,value)
        else
            obj._props[key]=value
            if key=="CFrame" and obj:IsA("BasePart") then
                obj._props.Position=value.Position
                if obj.Name=="HumanoidRootPart" then m.cfWrites+=1 end
            elseif key=="Position" and obj:IsA("BasePart") then
                local c=obj._props.CFrame or CF.new()
                obj._props.CFrame=CF.new(value)*c.Rotation
            end
        end
        if old~=value and obj._signals["Property_"..key] then obj._signals["Property_"..key]:Fire() end
    end
    env.Instance={new=function(cls,parent)
        local props={ClassName=cls,Name=cls,Visible=true,Enabled=true,Text="",BackgroundColor3=env.Color3.new(),
            Size=env.UDim2.new(),Position=env.UDim2.new(),CanvasSize=env.UDim2.new(),CanvasPosition=V.zero,
            Font=env.Enum.Font.Gotham,BackgroundTransparency=0,TextSize=14,AnchorPoint=V.zero}
        if partClasses[cls] then
            props.Position=V.zero; props.CFrame=CF.new(); props.Size=V.new(2,2,1)
            props.CanCollide=true; props.AssemblyLinearVelocity=V.zero; props.Velocity=V.zero
        elseif cls=="Humanoid" then
            props.PlatformStand=false; props.AutoRotate=true; props.WalkSpeed=16; props.JumpPower=50
            props.JumpHeight=7.2; props.Health=100; props.MaxHealth=100; props.MoveDirection=V.zero; props.HipHeight=2
        elseif cls=="Camera" then
            props.CFrame=CF.new(); props.ViewportSize=V.new(1280,720); props.CameraType=env.Enum.CameraType.Custom
        end
        local obj=setmetatable({_props=props,_children={},_signals={},_attributes={}},instmt)
        m.instances[#m.instances+1]=obj
        if parent then obj.Parent=parent end
        return obj
    end}
    m.new=env.Instance.new

    local function resume(co,...)
        local ok,delay=coroutine.resume(co,...)
        if not ok then m.errors[#m.errors+1]=tostring(delay)
        elseif coroutine.status(co)~="dead" then m.scheduled[co]=m.now+math.max(tonumber(delay) or 0.01,0.001) end
    end
    env.task={}
    function env.task.spawn(fn,...)
        local co=type(fn)=="thread" and fn or coroutine.create(fn)
        resume(co,...); return co
    end
    function env.task.wait(delay) return coroutine.yield(delay or 0.03) end
    function env.task.delay(delay,fn,...)
        local args=table.pack(...)
        local co=coroutine.create(function() fn(table.unpack(args,1,args.n)) end)
        m.scheduled[co]=m.now+(delay or 0); return co
    end
    function env.task.defer(fn,...) return env.task.delay(0,fn,...) end
    function env.task.cancel(co) m.scheduled[co]=nil; if coroutine.status(co)~="dead" then coroutine.close(co) end end
    function m:advance(dt)
        local target=self.now+dt
        local count=0
        while true do
            local co,at
            for t,when in pairs(self.scheduled) do if when<=target and (not at or when<at) then co,at=t,when end end
            if not co then break end
            self.now=at; self.scheduled[co]=nil; resume(co)
            count+=1; assert(count<10000,"scheduler runaway")
        end
        self.now=target
    end
    env.tick=function() return m.now end
    env.os=setmetatable({clock=function() return m.now end}, {__index=os})
    env.warn=function(...) m.warnings[#m.warnings+1]=table.concat({...}," ") end
    env.print=function() end -- omit hub banners, retain runner output

    local game=m.new("DataModel")
    env.game=game
    local workspace=m.new("Workspace",game)
    env.workspace=workspace; workspace.Gravity=196.2
    local camera=m.new("Camera",workspace)
    workspace.CurrentCamera=camera
    local services={Workspace=workspace,CoreGui=m.new("CoreGui",game)}
    function game:GetService(name) return assert(services[name],"unmocked service "..name) end
    function game:HttpGet() m.httpCalls+=1; error("network execution forbidden in tests") end
    game.PlaceId=1; game.JobId="mock-server"
    local players=m.new("Players",game)
    services.Players=players; players.PlayerAdded=signal(); players.PlayerRemoving=signal()
    local player=m.new("Player",players)
    player.Name="LocalTester"; player.UserId=1
    m.new("PlayerGui",player)
    m.player=player; players.LocalPlayer=player
    function players:GetPlayers() return self:GetChildren() end
    function player:IsFriendsWith() return false end
    function m:character(owner,position)
        owner=owner or player
        local char=self.new("Model",workspace)
        char.Name=owner.Name
        local root=self.new("Part",char); root.Name="HumanoidRootPart"; root.Position=position or V.new(0,30,0)
        local hum=self.new("Humanoid",char); hum.RootPart=root; char.PrimaryPart=root
        owner.Character=char
        return char,root,hum
    end
    m:character()
    local input={InputBegan=signal(),InputChanged=signal(),InputEnded=signal(),JumpRequest=signal(),
        WindowFocused=signal(),WindowFocusReleased=signal(),TouchEnabled=false,MouseEnabled=true,KeyboardEnabled=true}
    function input:IsKeyDown(key) return m.keys[key.Name]==true end
    function input:GetFocusedTextBox() return m.focused end
    function input:GetMouseLocation() return V.new(0,0) end
    function input:GetLastInputType() return env.Enum.UserInputType.Keyboard end
    services.UserInputService=input; m.input=input
    local run={Stepped=signal(),RenderStepped=signal(),Heartbeat=signal()}
    function run:BindToRenderStep(name,priority,fn)
        m.bindings[name]=m.bindings[name] or {}; table.insert(m.bindings[name],{priority=priority,fn=fn})
    end
    function run:UnbindFromRenderStep(name) m.bindings[name]=nil end
    services.RunService=run; m.run=run
    function m:frame(dt)
        dt=dt or 1/60; self:advance(dt); run.Stepped:Fire(self.now,dt)
        local callbacks={}
        for _,list in pairs(self.bindings) do for _,item in ipairs(list) do callbacks[#callbacks+1]=item end end
        table.sort(callbacks,function(a,b) return a.priority<b.priority end)
        for _,item in ipairs(callbacks) do
            local ok,err=pcall(item.fn,dt); if not ok then self.errors[#self.errors+1]=tostring(err) end
        end
        run.RenderStepped:Fire(dt); run.Heartbeat:Fire(dt)
    end
    services.TweenService={Create=function(_,obj,info,props)
        local tween={Completed=signal()}
        function tween:Play() for k,v in pairs(props) do obj[k]=v end; self.Completed:Fire() end
        function tween:Cancel() self.Completed:Fire() end
        return tween
    end}
    services.HttpService={JSONEncode=function() return "{}" end,JSONDecode=function() error("no JSON fixture") end,
        RequestAsync=function() m.httpCalls+=1; error("network execution forbidden in tests") end}
    services.TeleportService={Teleport=function() end,TeleportToPlaceInstance=function() end}
    services.MarketplaceService={GetProductInfo=function() return {Name="Mock Place"} end}
    services.GuiService={GetGuiInset=function() return V.zero,V.zero end}
    function workspace:Raycast() return nil end
    function workspace:GetPartBoundsInRadius(pos,radius,params)
        local out={}
        for _,obj in ipairs(self:GetDescendants()) do
            if obj:IsA("BasePart") and (obj.Position-pos).Magnitude<=radius then
                local excluded=false
                for _,root in ipairs((params and params.FilterDescendantsInstances) or {}) do
                    if obj==root or obj:IsDescendantOf(root) then excluded=true end
                end
                if not excluded then out[#out+1]=obj end
            end
        end
        return out
    end
    function services.CoreGui:GetGuiObjectsAtPosition() return {} end
    function player.PlayerGui:GetGuiObjectsAtPosition() return {} end
    env.gethui=function() return services.CoreGui end
    env.loadstring=function(source,name)
        local fn,err=loadstring(source,name)
        if fn then setfenv(fn,env) end
        return fn,err
    end
    function m:load(source)
        local fn,err=self.env.loadstring(source,"script.js")
        assert(fn,err)
        local result=fn()
        self.hub=result
        return result
    end
    function m:find(name) return game:FindFirstChild(name,true) end
    function m:count(name)
        local n=0
        for _,obj in ipairs(self.instances) do if obj.Name==name and obj.Parent and not obj._destroyed then n+=1 end end
        return n
    end
    function m:assertClean()
        assert(#self.errors==0,table.concat(self.errors,"\n"))
        assert(#self.propertyErrors==0,table.concat(self.propertyErrors,"\n"))
        assert(self.httpCalls==0,"test unexpectedly attempted HTTP")
    end
    return m
end
