// this is the technique that allow you to manege the event of multiple elemt by the sinple event listner on the common parent elemnt rather than on each individula child element 
// overalll it use the event bubbling and event capturing 
//it just like the bubbling and capturing bro , u just click on any div or button , then its outer div or top div get called or rendered 
{/* <body>
<div id="topdiv">its the topdiv
    <div id="midDiv">
        hllo from the mid div 
        <div id="innerdiv">
            <div id="evevntdelegation"></div> //here due innerdiv the evevntdelegation also gets affected 
            this is the inner div
        </div>
    </div>
</div> */}
//what the use : impove the performace by reducing the code 
//2 : handle the dynamic element , cleaner code 