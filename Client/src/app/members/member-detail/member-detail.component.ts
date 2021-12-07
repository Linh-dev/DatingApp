import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTabs: TabDirective;
  messages: Message[] = [];
  user: User;

  constructor(private route: ActivatedRoute, public presence: PresenceService,
    private messageService: MessageService, private accountService: AccountService, private router: Router) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data =>{
      this.member = data.member;
    })

    this.route.queryParams.subscribe(p =>{
      p.tab ? this.selectTab(p.tab) : this.selectTab(0);
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ]
    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[]{
    const imageUrl = [];
    for(const photo of this.member.photos){
      imageUrl.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrl;
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.userName).subscribe(res =>{
      this.messages = res;
    })
  }

  selectTab(tabIndex: number){
    this.memberTabs.tabs[tabIndex].active = true;
  }

  onTabActivated(data: TabDirective){
    this.activeTabs = data;
    if(this.activeTabs.heading === 'Messages' && this.messages.length === 0){
      this.messageService.createHubConnection(this.user, this.member.userName)
    }
    else{
      this.messageService.stopHubConnection();
    }
  }
}
