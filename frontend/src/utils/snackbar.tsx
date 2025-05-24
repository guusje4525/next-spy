import { reactRender } from "./react-render"
import { SnackbarComponent } from "./SnackbarComponent"

export function snackbar(title: string) {
    reactRender((container, root) => <SnackbarComponent container={container} root={root} title={title} />)
}
