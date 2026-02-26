import { Observable } from "rxjs";

export interface CheckDeactivate {
    canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>
}
