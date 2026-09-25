## Role app pages

<details open="open">
<summary>Contents</summary>

- [RoleComponent](#rolecomponent)
- [WeighingInComponent](#weighingincomponent)
- [ScoreboardComponent](#scoreboardcomponent)
- [LiftingOrderComponent](#liftingordercomponent)
- [DiscsSequenceComponent](#discssequencecomponent)
- [InformationComponent](#informationcomponent)
- [TimerComponent](#timercomponent)

</details>

---

### RoleComponent
The client entry page of the `Runtime` application.  
Allows the user to select the `role` for the current client device.
- Loads the translations required by the role entry page;
- Loads the `pages/entry` translation scope using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md)
- Provides available client roles;
- Assigns the selected role through [EntryService](services/shared.md#clientrole);
- Allows to leave the current Runtime session through [ExitService](services/shared.md#backtomode).

---

### WeighingInComponent

---

### ScoreboardComponent

---

### LiftingOrderComponent

---

### DiscsSequenceComponent

---

### InformationComponent

---

### TimerComponent

---
