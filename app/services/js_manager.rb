class JsManager < ApplicationService
  SNOW_SCRIPT = File.read(Rails.root + 'public/snow.js')

  def self.snow_script_for(account)
    snowflake_vars = <<-JS
      window._InSalesSnowFlakes = {
        count: #{account.snowflakes_count},
        speed: #{account.speed},
        color: '#{account.color}',
        size: #{account.size},
        hideOnMobile: #{account.hide_on_mobile}
      };
    JS

    "#{snowflake_vars}\n#{SNOW_SCRIPT}"
  end

  def self.update_all_scripts!
    Account.where('"accounts"."js_tag_id" IS NOT NULL').each do |account|
      install_or_update_script_for account
    end
  end

  def self.install_or_update_script_for(account)
    InsalesApi::App.configure_api account.insales_domain, account.password
    uninstall_script_for account
    account.js_tag_id = InsalesApi::JsTag.create(
      type: 'JsTag::TextTag',
      name: 'snow',
      content: snow_script_for(account)
    ).id
    account.save
  end

  def self.uninstall_script_for(account)
    return unless script_installed_for? account
    InsalesApi::App.configure_api account.insales_domain, account.password
    InsalesApi::JsTag.find(account.js_tag_id).destroy
  rescue
    # do nothing
  ensure
    account.update_attributes js_tag_id: nil
  end

  def self.script_installed_for?(account)
    account.js_tag_id
  end

  def initialize(account)
    @account = account
  end

  def install_or_update_script
    self.class.install_or_update_script_for @account
  end

  def uninstall_script
    self.class.uninstall_script_for @account
  end

  def script_installed?
    self.class.script_installed_for? @account
  end
end
