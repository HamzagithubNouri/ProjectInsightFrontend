import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  errorMessage: string | null = null;
  isSubmitting = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    this.isSubmitting = true;
    this.errorMessage = null;

    this.auth.login(email!, password!).subscribe({
      next: (user) => {
        this.isSubmitting = false;
        const target = user.role === 'student' ? '/student' : '/teacher';
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Email ou mot de passe incorrect.';
      },
    });
  }
}