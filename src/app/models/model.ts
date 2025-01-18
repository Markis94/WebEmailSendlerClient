export class EmailSendTask {
  id: number = 0;
  name: string = '';
  subject: string = '';
  createDate: Date = new Date(Date.now());
  startDate: Date = new Date(Date.now());
  endDate: Date = new Date(Date.now());
  csvData: string | null = null;
  emailSendInfo: SendInfo = new SendInfo();
  htmlMessage: string | null = null;
  sendTaskStatus: string = '';
  jobId: string = '';
}

export class Sample {
  id: number = 0;
  name: string = `шаблон ${new Date(Date.now()).getDate()}-${new Date(Date.now()).getMonth()}-${new Date(Date.now()).getFullYear()}`;
  createDate: Date = new Date(Date.now());
  changeDate: Date = new Date(Date.now());
  jsonString: string = '';
  htmlString: string = '';
}

export class EmailSendData {
  id: number = 0;
  email: string = '';
  isSuccess: boolean = false;
  errorMessage: string | null = null;
  lschet: string = '';
  sum: string = '';
  text: string = '';
  sendDate: Date = new Date(Date.now());
}

export class Part {
  items: Array<EmailSendData> = [];
  totalCount: number = 0;
}

export class SendInfo {
  maxCount: number = 0;
  sendCount: number = 0;
  currentSendCount: number = 0;
  successSendCount: number = 0;
  badSendCount: number = 0;
}

export class UploadFile {
  name: string | null = null;
  data: string = '';
  type: string | null = null;
  size: number | null = null;
}

export class TestSend
{
 emails:Array<string> = [''];
 subject: string = '';
 htmlString: string = '';
}

export class Configuration
{
  id: number = 0;
  server:string = "";
  login:string = "";
  password:string = "";
  hostEmailAddress:string = "";
  displayName:string = "";
  port: number = 25;
  enableSsl: boolean = false;
  threadCount:number = 5;
  threadSleep:number = 0;
  emailPackSize:number = 50;
}

export enum SendTaskStatusEnum {
  created = 'created',
  deleted = 'deleted',
  cancel = 'cancel',
  started = 'started',
  complete = 'complete',
}

export class ChartData{
  labels: Array<string> = [''];
  data: Array<number> = new Array<number>();
  name: string = '';
}

export class SearchEmailReport{
  email: string = '';
  count: number = 0;
  taskSendId: number = 0;
  taskSendName: string = '';
  createDate: Date = new Date(Date.now())
}