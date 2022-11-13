import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CONSTANT as Const } from '../../common/constants'
import { ScreenService as ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-mobile-check',
  templateUrl: './mobile-check.component.html',
  styleUrls: ['./mobile-check.component.scss']
})
export class MobileCheckComponent implements AfterViewChecked, AfterViewInit, AfterContentChecked, OnDestroy {
  screenSize: string = Const.SCREEN_SIZE.XL;
  destroySubject$: Subject<boolean> = new Subject();

  breakPoints = new Map([
    [Breakpoints.XSmall, Const.SCREEN_SIZE.XS],
    [Breakpoints.Small, Const.SCREEN_SIZE.S],
    [Breakpoints.Medium, Const.SCREEN_SIZE.M],
    [Breakpoints.Large, Const.SCREEN_SIZE.L],
    [Breakpoints.XLarge, Const.SCREEN_SIZE.XL],
  ]);

  constructor(
    breakpointObserver: BreakpointObserver,
    private screenService: ScreenService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.screenService.screenSource$ =
      breakpointObserver
        .observe([
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
          Breakpoints.Large,
          Breakpoints.XLarge,
        ])
        .pipe(
          takeUntil(this.destroySubject$),
          map(breakPointState => {
            let screenSize = Const.SCREEN_SIZE.XL;
            for (const q of Object.keys(breakPointState.breakpoints)) {
              if (breakPointState.breakpoints[q]) {
                screenSize = this.breakPoints.get(q);
                break;
              }
            }
            return screenSize;
          })
        );
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(true);
    this.destroySubject$.complete();
  }
}
