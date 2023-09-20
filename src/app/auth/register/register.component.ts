import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { register } from 'src/app/core/store/User/user.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  formError = '';
  constructor (private fb: FormBuilder, private store: Store) {}

  ngOnInit (): void {
    this.initForm();
  }

  onSubmit (): void {
    const value = this.registerForm.value;
    if (value.password === value.rePassword) {
      this.store.dispatch(
        register({ name: value.name, password: value.password })
      );
    } else {
      this.formError = 'Password not matched';
    }
  }

  private initForm (): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
