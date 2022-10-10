import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss']
})
export class SecondComponent implements OnInit {

  public pokemon$!: Observable<any>;
  public pokemonName = "";

  constructor(private api: ApiService) {
    //this.pokemon$ = api.searchPokemom('ditto')
   }

  ngOnInit(): void {
  }

  onChange(){
    console.log(this.pokemonName);
    this.pokemon$ = this.api.searchPokemom(this.pokemonName)
  }

}
