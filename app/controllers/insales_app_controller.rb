# This controller provides endpoints for application instalation and
# deinstallation
class InsalesAppController < ApplicationController
  def install
    ApplicationInstaller
      .new(params[:shop], params[:insales_id], params[:token])
      .install_application

    head :ok
  end

  def uninstall
    account = Account.find_by insales_id: params[:insales_id]
    JsManager.new(account).uninstall_script

    head :ok
  end
end
