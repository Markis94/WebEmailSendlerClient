export class EmailSendTask {
  id: number = 0;
  name: string = '';
  subject: string = '';
  createDate: Date = new Date(Date.now());
  startDate: Date | null = null;
  endDate: Date = new Date(Date.now());
  csvData: string | null = null; 
  //emailSendInfo: EmailSendInfo  = new EmailSendInfo(); 
  htmlMessage: string | null = null;
  sendTaskStatus:string = "";
  jobId:string = "";
}


export class EmailSendResult{
  id: number = 0;
  email: string = '';
  isSuccess:boolean = false;
  errorMessage:string | null = null;
  lschet:string = "";
  sum:string = "";
  text:string = "";
  sentDate: Date = new Date(Date.now());
}


export class Part
{
  items:Array<EmailSendResult> = [];
  totalCount:number = 0;
}


export class EmailSendInfo
{
  maxCount: number = 0;
  sendCount: number = 0;
  badSendCount:number = 0;
}

export class UploadFile {
  name: string | null = null;
  data: string = "";
  type: string | null = null;
  size: number | null = null;
}
