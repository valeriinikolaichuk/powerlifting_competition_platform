### Popup System

|Component	|Responsibility|
|-----------|--------------|
|`PopupService`|	Stores popup state and controls popup lifecycle|
|`PopupComponent`|	Global popup host|
|`InfoPopupComponent`|	Standard popup layout|
|`POPUP_DATA`	|Passes dynamic data through dependency injection|
|Popup Content Components|	Provide feature-specific popup content|

```
HomeComponent
      │
      ▼
PopupService.open()
      │
      ▼
PopupComponent
      │
      ▼
InfoPopupComponent
      │
      ▼
AboutContentComponent
```
