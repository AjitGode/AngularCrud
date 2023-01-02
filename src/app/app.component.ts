import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularCrud';
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness','price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 constructor(private dialog:MatDialog,private api:ApiService){

 }
  ngOnInit(): void {
    this.getallProducts()
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'35%',
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getallProducts();
      }
    })
  }
  getallProducts(){
     this.api.getProduct()
     .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
     })
  }
  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row,
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getallProducts();
      }
    })
  }
  deleteProduct(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        if(res.isConfirmed){
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success',
          )
          this.getallProducts();
        } 
     
      },
      error:()=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
