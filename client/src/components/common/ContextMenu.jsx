import React , {useEffect , useRef} from "react";

function ContextMenu({options, cordinates,contextMenu, setContextMenu}) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handelOutsideClick = (event) => {
    if (event.target.id !== "context-opener") {
      if (
        contextMenuRef.current && !contextMenuRef.current.contains(event.target)
      ) {
      setContextMenu(false);
      }
      }
      };
      document.addEventListener("click", handelOutsideClick);
      return () => {
        document.removeEventListener("click", handelOutsideClick);
      }
  },[]
  );
  const handelClick = (e,callback)=> {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };
  return <div className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
  ref = {contextMenuRef}
  style={{
    top:cordinates.y,
    left:cordinates.x
  }}
  >
    <ul>
      {
        options.map(({name,callback})=> (
          <li key={name} onClick={(e)=>handelClick(e,callback)} className="px-5 py-2 cursor-pointer hover:bg-background-default-hover" ><span className="text-white">{name}</span></li>
        ))
      }
    </ul>
  </div>;
}

export default ContextMenu;
