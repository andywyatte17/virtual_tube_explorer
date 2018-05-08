import { Injectable } from '@angular/core';

enum NotificationState { dunno, noPermissions, permissionsMaybe };

@Injectable()
export class NotifierService {
  private ns: NotificationState = NotificationState.dunno;

  constructor() {
    if (!("Notification" in window)) {
      return;
    }
    Notification.requestPermission().then((value: NotificationPermission) => {
      this.ns = value == "denied" ? NotificationState.noPermissions : NotificationState.permissionsMaybe;
    });
  }

  notify(msg: string) : Notification {
    if (this.ns != NotificationState.noPermissions)
      return new Notification(msg);
  }
}
