# This service processes InSales application instalation.
# It find or creates acoount and creates a bill
class ApplicationInstaller < ApplicationService
  APPLICATION_SECRET =
    Rails.application.secrets.insales[:secret_token]

  attr_accessor :domain
  attr_accessor :insales_id
  attr_accessor :token

  def initialize(domain, insales_id, token)
    self.domain = domain
    self.insales_id = insales_id
    self.token = token
  end

  def install_application
    account = Account.find_by insales_id: insales_id
    if account
      account.update_attributes params
    else
      Account.create params
    end
  end

  private

  def params
    {
      insales_id: insales_id,
      insales_domain: domain,
      password: password
    }
  end

  def password
    @password ||= Digest::MD5.hexdigest("#{token}#{APPLICATION_SECRET}")
  end
end
