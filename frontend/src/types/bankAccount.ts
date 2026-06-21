export interface BankAccount {
  _id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  branch?: string
  qrCodeImage?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}


