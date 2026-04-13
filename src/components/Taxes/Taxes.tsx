import React, { useState } from 'react';
import ContentContainer from '../ContentContainer';
import Collapse from '../ui/collapse';
import { Button } from '@circleco/compass/components/Button';
import { Link } from '@circleco/compass/components/Link';
import { Badge } from '@circleco/compass/components/Badge';

interface TaxesProps {
  onToggleSidebar: () => void;
}

const Taxes: React.FC<TaxesProps> = ({ onToggleSidebar }) => {
  const [taxPricing, setTaxPricing] = useState('exclude');

  return (
    <ContentContainer title="Taxes" onToggleSidebar={onToggleSidebar}>
      <div className="overflow-y-auto">
        <div className="p-6 space-y-6 max-w-3xl mx-auto">
          {/* Stripe Tax enabled */}
          <div className="bg-primary border border-primary rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="shrink-0">
                <Badge label="ACTIVE" variant="success" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Stripe Tax enabled
                </h3>
                <p className="text-sm text-secondary">
                  You have enabled Stripe Tax, you can edit business details
                  including: your origin address, general product tax category,
                  and registrations in <Link href="#">Stripe Tax settings</Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Enable Stripe Tax collection */}
          <div className="bg-primary border border-primary rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="shrink-0">
                <Badge label="ENABLED" variant="success" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Enable Stripe Tax collection
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Circle integrates with <Link href="#">Stripe Tax</Link> to
                  collect taxes on your paywall purchases. While Stripe Tax can
                  help you collect and report on taxes, you&apos;re responsible
                  for <Link href="#">filing and remitting these taxes</Link>{' '}
                  using a Stripe Tax partner such as{' '}
                  <Link href="#">TaxJar&apos;s AutoFile solution (US)</Link> or{' '}
                  <Link href="#">Taxually (EU and APAC)</Link>. Transactions
                  processed with Stripe Tax incur an{' '}
                  <Link href="#">additional fee from Stripe</Link>.
                </p>
                <p className="text-sm text-secondary mb-6">
                  Please click on the button below to activate tax collection
                  with Stripe Tax. Once activated, taxes will be displayed and
                  collected for new subscriptions whenever a billing address
                  matches a state or country you&apos;re registered to collect
                  taxes from.
                </p>

                {/* Tax pricing */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-primary mb-3">
                    Tax pricing
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="taxPricing"
                        value="include"
                        checked={taxPricing === 'include'}
                        onChange={e => setTaxPricing(e.target.value)}
                        className="w-4 h-4 text-link border-hover focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Include taxes in the price total
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="taxPricing"
                        value="exclude"
                        checked={taxPricing === 'exclude'}
                        onChange={e => setTaxPricing(e.target.value)}
                        className="w-4 h-4 text-link border-hover focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Don&apos;t include taxes in the price total
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-3">
                  <Button variant="primary">Update</Button>
                  <Button variant="destructive">Disable tax collection</Button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-primary border border-primary rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">FAQs</h3>
            <div className="space-y-3">
              <Collapse title="Understanding sales tax compliance">
                <p>
                  Sales tax compliance involves understanding when and where you
                  need to collect taxes based on your business location and
                  customer locations. This includes nexus requirements, tax
                  rates, and filing obligations.
                </p>
              </Collapse>
              <Collapse title="Monitoring tax thresholds">
                <p>
                  Tax thresholds determine when you&apos;re required to collect
                  sales tax in a particular state or country. These thresholds
                  are based on sales volume or transaction count and vary by
                  jurisdiction.
                </p>
              </Collapse>
              <Collapse title="Registering for sales tax, VAT and GST">
                <p>
                  Registration requirements vary by jurisdiction. In the US, you
                  typically register with state tax authorities. In the EU, you
                  register for VAT. In other countries, you may need to register
                  for GST or similar consumption taxes.
                </p>
              </Collapse>
              <Collapse title="Tax Reporting">
                <p>
                  Tax reporting involves filing regular returns with tax
                  authorities, reporting collected taxes, and maintaining proper
                  records. The frequency and format vary by jurisdiction and
                  your business size.
                </p>
              </Collapse>
              <Collapse title="How much does Stripe Tax cost?">
                <p>
                  Stripe Tax charges a fee of 0.5% on transactions where tax is
                  calculated and collected. This fee is in addition to your
                  standard Stripe processing fees and is only charged when tax
                  is actually collected.
                </p>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Taxes;
