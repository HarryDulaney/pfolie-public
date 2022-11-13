import { Component, OnInit } from '@angular/core';
import { FeedItem, ParsedFeedItem, RssFeed } from 'src/app/models/rssfeed';
import { NewsService } from 'src/app/components/news/news.service';
import { FEED_SOURCES } from '../../common/constants';
import { ArticleService } from './article.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit {

  feedItems: FeedItem[];
  filteredFeedItems: FeedItem[] = [];
  displayedFeed: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>([]);

  isLoading: boolean = false;
  allCategories: string[] = FEED_SOURCES;
  filterBy: string = '';

  constructor(public newsService: NewsService,
    public articleService: ArticleService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.feedItems = [];

    this.newsService.getAllFeedItems().then(
      (feeds: RssFeed[]) => {
        for (let feed of feeds) {
          this.feedItems.push(...feed.items);
        }
      }
    ).finally(() => {
      this.runFilter();
      this.displayedFeed.next(this.filteredFeedItems);
      this.isLoading = false;
    });
  }

  runFilter() {
    if (this.filterBy && this.filterBy !== '') {
      this.filteredFeedItems = this.feedItems.filter(feedItem => {
        return feedItem.source === this.filterBy;
      });
    } else {
      this.filteredFeedItems = this.feedItems;
    }
    this.displayedFeed.next(this.filteredFeedItems);
  }

  newsSourceSelected(source: string) {
    this.filterBy = source;
    this.runFilter();
    this.displayedFeed.next(this.filteredFeedItems);
  }

  openHandler(feedItem: ParsedFeedItem) {
    this.articleService.next(feedItem);
    this.router.navigate(['/', 'feature']);

  }

  closeHandler(event: any) {
    this.articleService.next(null);
  }

  selectAllSources() {
    this.filterBy = '';
    this.filteredFeedItems = this.feedItems;
    this.displayedFeed.next(this.filteredFeedItems);
  }

  getStyleClass(source: string) {
    if (this.filterBy === '') {
      return 'bg-gray-600';
    } else if (this.filterBy === source) {
      return 'bg-blue-300';
    }

    return 'bg-gray-600';

  }
}