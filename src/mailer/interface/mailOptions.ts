export interface MailOptions {
    from?: string, 
    to: string, // list of receivers (separated by ,)
    subject: string, 
    text: string, 
    html: string
}