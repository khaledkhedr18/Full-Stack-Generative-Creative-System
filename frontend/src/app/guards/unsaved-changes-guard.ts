import { CanDeactivateFn } from '@angular/router';
import { CheckDeactivate } from '../utils/check-deactivate';

export const unsavedChangesGuard: CanDeactivateFn<CheckDeactivate> = (component, currentRoute, currentState, nextState) => {
  if(component.canDeactivate){
    return component.canDeactivate()
  }
  return true
};
