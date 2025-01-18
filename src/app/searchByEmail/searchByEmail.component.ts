import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap } from 'rxjs';
import { SearchEmailReport } from '../models/model';
import { SendlerService } from '../services/sendler.service';

@Component({
  selector: 'app-searchByEmail',
  templateUrl: './searchByEmail.component.html',
  styleUrls: ['./searchByEmail.component.css'],
  standalone: false,
})
export class SearchByEmailComponent implements OnInit, AfterViewInit {
  searchEmailReport$: Observable<SearchEmailReport[]> | null = null;
  inputValue: string = '';
  displayedColumns: string[] = ['taskSendName', 'email', 'count', 'createDate'];
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 15, 25, 50, 100];
  dataSource!: MatTableDataSource<SearchEmailReport>;
  btnLocK: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length: number = 0;
  paginatorHidden:boolean = true;
  startSearch:boolean = false;
  constructor(private sendlerApiService: SendlerService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Показать';
    this.paginator._intl.firstPageLabel = 'В начало';
    this.paginator._intl.lastPageLabel = 'В конец';
    this.paginator._intl.nextPageLabel = 'Далее';
    this.paginator._intl.previousPageLabel = 'Назад';
  }


  Find(inputValue: string) {
    if (!inputValue) {
      return;
    }

    this.startSearch = true;
    this.searchEmailReport$ = this.sendlerApiService.SearchResultByEmail(inputValue)
    .pipe(
      tap((result)=>{
        this.dataSource = new MatTableDataSource(result);
        this.length = result.length;
        this.dataSource.paginator = this.paginator;
        this.paginatorHidden = this.length<=0?true:false;
      })
    )
  }

  Reset(inputValue: string) {
    this.paginatorHidden = true;
    this.startSearch = false;
    if (!inputValue) {
      this.searchEmailReport$ = null;
    }
  }
}
