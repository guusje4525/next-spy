import { createRoot, Root } from "react-dom/client"
import notNull from "../../../backend/utils/notNull"

export function reactRender(children: (container: HTMLElement, root: Root) => React.ReactNode, parentElement?: HTMLElement | null) {
    const container = parentElement ?? document.body.appendChild(document.createElement("div"))
    const root = createRoot(notNull(container))
    root.render(children(container, root))
}
