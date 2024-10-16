export interface LocaleInterface extends base {
    //Shared
    
    //Sidebar
    menu: string;
    home: string;
    profile: string;
    settings: string;
    logout: string;

    //Home page

    //Profile page
    account_details: string;
    service: string;
    free: string;
    premium: string
    single_sign_on: string;
    single_sign_on_used: string;
    update: string;
    change_password: string;
    add_password: string;
    add_password_description: string;
    current_password: string;
    new_password: string;

    //Settings page
    change_language: string;
    change_theme: string;
    dark_mode: string;
    light_mode: string;
    delete_account: string;
    are_you_sure_you_want_to_delete_your_account: string;
    delete: string;
    back: string;

    //Auth
    email: string;
    password: string;
    name: string;
    show: string;
    hide: string;
    enter_your_email: string;
    enter_your_password: string;
    enter_your_name: string;
    confirm_your_password: string;

    //Login
    login: string;
    email_and_password_are_required: string;
    login_successful: string;
    invalid_login_credentials: string;
    dont_have_an_account: string;
    register_here: string;

    //Registration
    register: string;
    confirm_password: string;
    all_fields_are_required: string;
    passwords_do_not_match: string;
    email_already_in_use: string;
    registration_successful: string;
    already_have_an_account: string;
    login_here: string;
}

interface base {
    [key: string]: string;
}
