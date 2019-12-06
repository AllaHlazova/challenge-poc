import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserComponent} from './user/user.component';
import {JobsComponent} from './jobs/jobs.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
  },
  {
    path: 'jobs',
    component: JobsComponent,
  },
  {
    path: '**',
    redirectTo: '/users',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
