import { Exclude } from 'class-transformer';
import { RequestSuccessfulRo } from '../../@common/models/request-successful.ro';

@Exclude()
export class PrintingReceiptRo extends RequestSuccessfulRo {}
