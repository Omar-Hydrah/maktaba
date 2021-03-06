import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BookService, AuthorService } from "../service/";
import { Book, Author } from "../model/";

// declare var $ : any; 

@Component({
    selector: 'book-form-component',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

	bookForm         : FormGroup;
	titleField       : FormControl;
	descriptionField : FormControl;
    authorField      : FormControl; 
    authors          : Author[]; 
    book             : Book = {
        id: null,
        title: "",
        description: "",
        author : {id: null, name: ""}
    }

    constructor(private bookService : BookService, 
        private authorService : AuthorService, private router : Router) {}

    ngOnInit() {
        this.authorService.getAll().subscribe((authors : Author[])=>{
            this.authors = authors;
        });

        this.titleField       = new FormControl("", [
            Validators.required,
            Validators.minLength(4),
        ]);
        this.descriptionField = new FormControl("", [
            Validators.required,
            Validators.minLength(10),
        ]);
        this.authorField      = new FormControl("", Validators.required);

        this.bookForm = new FormGroup({
            titleField       : this.titleField,
            authorField      : this.authorField,
            descriptionField : this.descriptionField,
        });

    }

	handleSubmit(){
        if(this.titleField.errors || this.descriptionField.errors 
            || this.authorField.errors)
        {
            return;
        }

        this.book.title       = this.titleField.value;
        this.book.description = this.descriptionField.value;
        this.book.author = this.authors.filter(author => {
            return author.id == this.authorField.value
        })[0];
        
        this.bookService.createBook(this.book).subscribe((book : Book)=>{
            if(book != null){
                console.log("Book saved");
                if(book.id != null){
                    this.router.navigate(["/book", book.id]);
                }else{
                    this.router.navigate(["/"]);
                }
            }else{
                console.log("Failed to save book");
            }
        });
	}    
}