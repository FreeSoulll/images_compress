class JsController < ApplicationController
  helper_method :paid?, :installed?, :current_account

  def main
    session[:insales_id] = params[:insales_id] if params[:insales_id]
  end

  def update_settings
    current_account.update_attributes account_params
    js_manager.install_or_update_script if paid? && installed?
    redirect_to action: :main
  end

  private

  def current_account
    @account ||= Account.find_by insales_id: session[:insales_id]
  end

  def paid?
    @paid ||= biller.paid?
  end

  def biller
    @biller ||= Biller.new(current_account)
  end

  def js_manager
    @js_manager ||= JsManager.new(current_account)
  end

  def installed?
    @installed ||= js_manager.script_installed?
  end

  def account_params
    params.require(:account).permit(
      :color,
      :speed,
      :snowflakes_count,
      :size,
      :hide_on_mobile
    )
  end
end
