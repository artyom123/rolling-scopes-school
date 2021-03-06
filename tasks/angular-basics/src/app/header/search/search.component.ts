import { Component, OnInit, DoCheck } from '@angular/core';
import { StoreService } from '../../store.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, DoCheck {
  tasks: Object[];
  asyncSelected: string;
  loading: boolean;
  noResults: boolean;
  dataSource: Observable<any>;
  selectedTaskUrl: string;
  isDone: boolean = false;
  doneTasks: Object[] = [];

  constructor(private _data: StoreService) {
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.asyncSelected);
    }).mergeMap((token: string) => this.getStatesAsObservable(token));
  }

  ngOnInit() {
    this._data.allTasks.subscribe(res => this.tasks = res);
  }

  ngDoCheck() {
    this.doneTasks = this.tasks.filter((item: any) => item.isDone);
  }

  getStatesAsObservable(token: string): Observable<any> {
    const query = new RegExp(token, 'ig');

    if (this.isDone) {
      return Observable.of(
        this.doneTasks.filter((state: any) => {
          return query.test(state.title);
        })
      );
    } else {
      return Observable.of(
        this.tasks.filter((state: any) => {
          return query.test(state.title);
        })
      );
    }
  }

  showLoading(loading: boolean): void {
    this.loading = loading;
  }

  showNoResults(hasMatches: boolean): void {
    this.noResults = hasMatches;
  }

  onSelect(matchWord: TypeaheadMatch): void {
    this._data.updateTask(matchWord.item);
    this.selectedTaskUrl = `/category/${matchWord.item.categoryTitle}/${matchWord.item.title}`;
  }

  setTaskDoneOption(): void {
    this.isDone = !this.isDone;
  }
}
