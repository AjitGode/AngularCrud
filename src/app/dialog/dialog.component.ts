import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import Swal from 'sweetalert2';
import 'animate.css';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  FreshnessList = ["Brand New", "Second hand", "Refubrished"];
  productForm !: FormGroup;
  actionbtn: string = "Save"
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogref: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    })
    if (this.editData) {
      this.actionbtn = "Update"
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }
  addproduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                title: 'Product Added successfully',
                showConfirmButton: false,
                timer: 1500
              })

              this.productForm.reset();
              this.dialogref.close('save');
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
            }
          })
      }
    } else {
      this.updateData()
    }
  }
  updateData() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Product Updated successfully',
            showConfirmButton: false,
            timer: 1500
          })

          this.productForm.reset()
          this.dialogref.close('update')
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
        }
      })
  }
}
