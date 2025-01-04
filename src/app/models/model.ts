export class EmailSendTask {
  id: number = 0;
  name: string = '';
  subject: string = '';
  createDate: Date = new Date(Date.now());
  startDate: Date | null = null;
  endDate: Date = new Date(Date.now());
  csvData: string | null = null;
  emailSendInfo: SendInfo = new SendInfo();
  htmlMessage: string | null = null;
  sendTaskStatus: string = '';
  jobId: string = '';
}

export class Sample {
  id: number = 0;
  name: string = '';
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


export enum SendTaskStatusEnum {
  created = 'created',
  deleted = 'deleted',
  cancel = 'cancel',
  started = 'started',
  complete = 'complete',
}
