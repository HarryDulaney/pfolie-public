import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CoinResourcesComponent } from './components/coin-resources/coin-resources.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewsComponent } from './components/news/news.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { FeatureComponent } from './components/news/feature/feature.component';
import { AuthGuard } from './services/auth/auth.guard';
import { RouteGuard } from './services/route.guard';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SmStatCardComponent } from './components/portfolio/components/parts/sm-stat-card/sm-stat-card.component';
import { MedStatCardComponent } from './components/portfolio/components/parts/med-stat-card/med-stat-card.component';
import { TrackingComponent } from './components/portfolio/components/tracking/tracking.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'tracking', component: TrackingComponent, canActivate: [AuthGuard] },
  { path: 'sm', component: SmStatCardComponent },
  { path: 'md', component: MedStatCardComponent },
  { path: 'news', component: NewsComponent },
  { path: 'feature', component: FeatureComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'tokens/:id', component: CoinResourcesComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}

