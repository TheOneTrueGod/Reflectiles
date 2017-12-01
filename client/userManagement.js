class UserManagement {
  constructor() {
    this.user_token = null;
  }

  getUserToken() {
    return this.user_token;
  }

  RecieveUserToken(user_token) {
    this.user_token = user_token;
    //Cookies.set("user_token", user_token);
  }

  GetUserTokenFromCookie() {
    //this.user_token = Cookies.get("user_token");
  }

  CheckForTokenOnLoginPage() {
    /*if (this.user_token) {

    }*/
  }
}

UserManagement = new UserManagement();
