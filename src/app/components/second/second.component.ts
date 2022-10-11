import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss']
})
export class SecondComponent implements OnInit {

  public pokemon$!: Observable<any>;
  public pokemonName = "pikachu";

  constructor(private api: ApiService) {
    /* this.api.searchPokemom('charmander').subscribe(
      {next: value => {
        console.log(value);
        
      }}
    ) */
    this.pokemon$ = this.api.searchPokemom(this.pokemonName).pipe(
      tap(console.log)
    )
   }

  ngOnInit(): void {
  }

  onChange(){
    console.log(this.pokemonName);
    this.pokemon$ = this.api.searchPokemom(this.pokemonName).pipe(
      tap(console.log)
    )
  }

}
