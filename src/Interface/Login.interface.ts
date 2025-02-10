export interface UserDetailsType{
    userName:string;
    password:string;
}

export interface UserDetailsError{
    userNameError:string;
    passwordError:string;
}

export interface RegisterUserDetailType{
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    confirmpassword:string;
}
export interface RegisterUserDetailError{
    firstnameError:string;
    lastnameError:string;
    emailError:string;
    passwordError:string;
    confirmPasswordError:string;
}
export interface edituserDetailError{
    firstnameError:string;
    lastnameError:string;
  
}
export interface edituserproductError{
    productnameError:string;
    quantityError:string;
    priceError:string;
  
}
export interface productAddError{
    productnameAddError:string;
    quantityAddError:string;
    priceAddError:string;
  
}


export interface addOrderError{
    productError:string;
    quantityError:string;
    paymenentmethodError:string;
    addressError:string;

}
export interface addingOrderError{
    productAddError:string;
    quantityAddError:string;
    paymenentmethodAddError:string;
    addressAddError:string;

}

