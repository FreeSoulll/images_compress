# Service which works with InSales billing system
class Biller < ApplicationService
  PRICE = 199 # rub per year

  def initialize(account, year: (Time.now + 1.month).year)
    @account = account
    @year = year
    InsalesApi::App.configure_api @account.insales_domain, @account.password
  end

  def paid?
    return true
  end

  def bill
    if account_bill
      account_bill.destroy unless application_charge
      account_bill.destroy if application_charge && application_charge_declined?
      return if (@account_bill = @account.bills.find_by(year: @year))
    end

    charge_id = InsalesApi::ApplicationCharge.create(
      name: 'Передача неисключительного права на расширенный функционал ' \
            'программы для ЭВМ InSales «Приложение Новый Год» до 01 '     \
            "февраля #{@year}",
      price: PRICE
    ).id
    @account_bill = @account.bills.create  year: @year,
                                           application_charge_id: charge_id
  end

  private

  def application_charge_declined?
    application_charge.status == 'declined'
  end

  def application_charge_paid?
    application_charge.status == 'accepted'
  end

  def account_bill
    @account_bill ||= @account.bills.find_by year: @year
  end

  def application_charge
    @application_charge =
      InsalesApi::ApplicationCharge.find account_bill.application_charge_id
  rescue ActiveResource::ResourceNotFound
    return
  end
end
