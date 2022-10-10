import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent implements OnInit {

  username: string = "";
  password: string = "";

  constructor(public api: ApiService, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    this.api.login(this.username, this.password).subscribe({
      next:(resp) =>{
        this.dataService.session$.next({
          username: this.username,
          token: resp.token
        })
        this.router.navigate(['search'])
      } 
    })
  }

}
