import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
import { WidgetComponent } from './widget/widget.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'widget', component: WidgetComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ChatWidgetComponent,
    WidgetComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}


