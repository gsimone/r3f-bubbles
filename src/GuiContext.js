import React, {
    useContext,
useRef
} from 'react'
import * as dat from 'dat.gui'

export const guiContext = React.createContext()

const gui = new dat.GUI()

function GuiContext(props) {

    return <guiContext.Provider value={{gui}}>{props.children}</guiContext.Provider>
    
}

export function useGui(stuff) {

    const { gui } = useContext(guiContext)

    const data = useRef(Object.keys(stuff).reduce((acc, key) => {
        acc[key] = stuff[key][0]
        return acc
    }, {}))

    React.useEffect(( )=> {

        Object.entries(stuff)
            .forEach(([key, value]) => {
                gui.add(data.current, key, ...value.slice(1))
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return data

}

export function useGuiState(key, init, ...args) {

    const [state, setState] = React.useState(init)

    const { gui } = useContext(guiContext)

    const controller = useRef({})
    React.useEffect(() => {

        controller.current = gui.add({
            [key]: init,
        }, key, ...args)

        controller.current.onChange(value => {
            setState(value)
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return state
}

useGuiState.color = function useGuiStateColor(key, init) {
    const [state, setState] = React.useState(init)

    const { gui } = useContext(guiContext)

    const controller = useRef({})
    React.useEffect(() => {

        controller.current = gui.addColor({
            [key]: init,
        }, key)

        controller.current.onChange(value => {
            setState(value)
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return state
}

export default GuiContext
