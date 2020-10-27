import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-socio-creditos',
  templateUrl: './socio-creditos.component.html',
  styleUrls: ['./socio-creditos.component.css']
})
export class SocioCreditosComponent implements OnInit {
  token: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(({token}) => this.token = token);
  }

  ngOnInit() {
    console.log(this.token);
  }

}
