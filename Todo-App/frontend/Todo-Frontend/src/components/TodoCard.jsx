export function TodoCard( { children }){

    return (
        <div>
             <div className="p-6 m-4 h-5/6 flex flex-col justify-center bg-orange-400 rounded-md">
            {children}
        </div>
        </div>
    )
}