import {Directive, Attribute, ElementRef, DynamicComponentLoader, Inject} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';
import {Login} from '../components/Login';
import { contentHeaders } from '../common/headers';

@Directive({
  selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;

  constructor(@Inject(ElementRef) _elementRef: ElementRef, @Inject(DynamicComponentLoader) _loader: DynamicComponentLoader, @Inject(Router)
    _parentRouter: Router, @Attribute('name') nameAttr: string) {
    super(_elementRef, _loader, _parentRouter, nameAttr);

    this.parentRouter = _parentRouter;
    this.publicRoutes = {
      '/login': true,
      '/signup': true
    };
  }

  activate(instruction: ComponentInstruction) {
    var url = this.parentRouter.lastNavigationAttempt;
    if (!this.publicRoutes[url] && !localStorage.getItem('Access-Token')) {
      this.parentRouter.navigateByUrl('/login');
    }
    return super.activate(instruction);
  }
}