import React, { useState } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { CommunitySectionHeader } from '@/components/Community/CommunitySectionHeader';

// Local image assets
const img = '/images/avatars/1.png';
const img1 = '/images/avatars/2.png';
const img2 = '/images/avatars/3.png';
const img12 = '/images/avatars/4.png';
const imgAvatar = '/images/avatars/5.png';
const imgFrame1000004749 = '/images/placeholders/image-1.png';
const imgImage1885 = '/images/avatars/6.png';
const imgImage1867 = '/images/avatars/7.png';
const imgImage1889 = '/images/avatars/8.png';
const imgLinaBoAVeryRealisticPhotoOfABusinessManOf40YearsOld8463Adc808B04B12923A7119Dc2C3C291 =
  '/images/avatars/1.png';
const img17 = '/images/avatars/2.png';
const img18 = '/images/avatars/3.png';
const img19 = '/images/avatars/4.png';

interface HomeProps {
  communityType?: 'oprah' | 'clarity' | 'framer' | 'default';
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const Home: React.FC<HomeProps> = () => {
  const [activeFeedFilter, setActiveFeedFilter] = useState<
    'all' | 'boost-mental-health' | 'grow-wealth'
  >('all');

  return (
    <div className="bg-primary flex-1 flex flex-col items-center gap-6 px-9 py-0 overflow-auto">
      {/* Header */}
      <CommunitySectionHeader
        title="Start here"
        actions={
          <>
            <button type="button" className="h-9 px-4 text-sm font-medium border border-primary rounded-lg flex items-center gap-2 hover:bg-hover transition-colors">
              Latest
              <Icon name="chevron-down" size="sm" />
            </button>
            <button type="button" className="h-9 px-4 text-sm font-medium border border-primary rounded-lg flex items-center gap-2 hover:bg-hover transition-colors">
              <Icon name="bullet-list" size="sm" />
              Summarize
            </button>
            <button type="button" className="h-9 px-4 text-sm font-medium bg-[#506cf0] text-white rounded-lg hover:opacity-90 transition-opacity">
              New post
            </button>
            <button type="button" className="h-9 w-9 rounded-xl border border-primary flex items-center justify-center hover:bg-hover transition-colors" aria-label="More options">
              <Icon name="dot-menu" size="sm" />
            </button>
          </>
        }
      />

      {/* Main Content */}
      <div className="flex flex-col items-start max-w-[1280px] w-full">
        <div className="flex gap-6 items-start justify-center w-full">
          {/* Feed Column */}
          <div className="flex flex-col gap-5 items-start shrink-0 w-[680px]">
            {/* Filter Tabs */}
            <div className="flex gap-1 items-center">
              <button
                type="button"
                className={`h-9 px-4 rounded-xl text-sm font-medium transition-colors ${activeFeedFilter === 'all' ? 'border border-primary bg-primary' : 'hover:bg-hover'}`}
                onClick={() => setActiveFeedFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`h-9 px-4 rounded-xl text-sm font-medium text-tertiary transition-colors ${activeFeedFilter === 'boost-mental-health' ? 'border border-primary bg-primary' : 'hover:bg-hover'}`}
                onClick={() => setActiveFeedFilter('boost-mental-health')}
              >
                Boost mental health
              </button>
              <button
                type="button"
                className={`h-9 px-4 rounded-xl text-sm font-medium text-tertiary transition-colors ${activeFeedFilter === 'grow-wealth' ? 'border border-primary bg-primary' : 'hover:bg-hover'}`}
                onClick={() => setActiveFeedFilter('grow-wealth')}
              >
                Grow wealth
              </button>
            </div>

            {/* Start a post */}
            <div className=" flex flex-col items-start overflow-hidden rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] w-full">
              <div className="border border-primary flex flex-col items-start justify-center px-6 py-5 rounded-2xl w-full">
                <div className="flex gap-4 items-center w-full">
                  <Avatar size="sm" src={img12} />
                  <Typography
                    component="p"
                    variant="body-md"
                    color="tertiary"
                    className="flex-1"
                  >
                    <span className="leading-6 min-h-0 min-w-0 relative shrink-0 tracking-normal whitespace-pre-wrap">Start a post...</span>
                  </Typography>
                  <button type="button" className="shrink-0 size-8 rounded-xl bg-secondary hover:bg-hover transition-colors flex items-center justify-center" aria-label="Create post">
                    <Icon name="arrow-up" size="sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* Post Card */}
            <div className="border border-primary flex flex-col items-start overflow-hidden rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] w-[680px]">
              <div className="flex flex-col items-start justify-center pl-6 pr-6 py-6 rounded-bl-lg rounded-br-lg w-full">
                <div className="flex flex-col gap-0 items-start overflow-hidden rounded-lg w-full">
                  <div className="flex flex-col gap-6 items-start w-full">
                    <div className="flex flex-col gap-5 items-start w-full">
                      {/* Avatar & Info */}
                      <div className="flex gap-3 items-center w-full">
                        <Avatar size="sm" src={imgAvatar} />
                        <div className="flex flex-1 flex-col items-start min-h-0 min-w-0 relative shrink-0">
                          <div className="flex h-[22px] items-start justify-between w-full">
                            <div className="flex flex-1 gap-2 items-start min-h-0 min-w-0 relative shrink-0">
                              <Typography
                                component="span"
                                variant="label-md"
                                color="primary"
                              >
                                <span className="leading-5">Melissa Emberson</span>
                              </Typography>
                            </div>
                            <button type="button" className="size-8 rounded-lg flex items-center justify-center hover:bg-hover transition-colors" aria-label="Post options">
                              <Icon name="dot-menu" size="sm" />
                            </button>
                          </div>
                          <div className="flex gap-2 items-center relative shrink-0">
                            <Typography
                              component="span"
                              variant="body-sm"
                              color="tertiary"
                            >
                              <span className="leading-5">Sep 10</span>
                            </Typography>
                            <div className="relative shrink-0 size-[2.5px]">
                              <div className="absolute inset-0 bg-[#717680] rounded-full" />
                            </div>
                            <Typography
                              component="span"
                              variant="body-sm"
                              color="tertiary"
                            >
                              <span className="leading-5 overflow-ellipsis overflow-hidden w-[479px] whitespace-nowrap inline-block">Clarity Team Writer</span>
                            </Typography>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="flex flex-col items-center w-full">
                        <div className="flex flex-col gap-4 items-start w-full">
                          {/* Title */}
                          <div className="flex items-center justify-center w-full">
                            <Typography
                              component="p"
                              variant="heading-sm"
                              color="primary"
                              className="flex-1"
                            >
                              <span className="leading-7 min-h-0 min-w-0 relative shrink-0 tracking-[-0.4px] whitespace-pre-wrap">Welcome to the Clarity Community!</span>
                            </Typography>
                          </div>
                          {/* Body */}
                          <div className="flex items-center justify-center w-full">
                            <div className="flex-1 min-h-0 min-w-0 relative shrink-0 tracking-normal whitespace-pre-wrap">
                              <Typography
                                component="p"
                                variant="body-md"
                                color="secondary"
                              >
                                {`Hey there! 👋 We\u2019re so excited to have you join us.`}
                              </Typography>
                              <Typography
                                component="p"
                                variant="body-md"
                                color="secondary"
                              >
                                &nbsp;
                              </Typography>
                              <Typography
                                component="p"
                                variant="body-md"
                                color="secondary"
                              >
                                This space is all about learning, sharing, and
                                growing together as we navigate the world of
                                business. Whether you&apos;re an entrepreneur,
                                freelancer, or part of a growing team — you
                                belong here.
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Media */}
                      <div className="bg-[#133871] h-[295.833px] overflow-hidden relative rounded rounded-[4px] w-full">
                        <div className="absolute h-[295px] left-1/2 top-[calc(50%+31.58px)] translate-x-[-50%] translate-y-[-50%] w-[225px]">
                          <img
                            alt=""
                            className="block max-w-none size-full"
                            src={imgFrame1000004749}
                          />
                        </div>
                        <div className="absolute bg-[#b6d1ff] h-[70.638px] left-[161.99px] overflow-hidden rounded-[54.25px] top-[97.36px] w-[70.635px]">
                          <div className="absolute h-[91.423px] left-[-9.48px] top-[4.26px] w-[97.108px]">
                            <img
                              alt=""
                              className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
                              src={imgImage1885}
                            />
                          </div>
                        </div>
                        <div className="absolute bg-[#0166fe] h-[70.638px] left-[390px] overflow-hidden rounded-[54.25px] top-[133px] w-[70.635px]">
                          <div className="absolute h-[79.817px] left-[-9.89px] top-[2.12px] w-[89.706px]">
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <img
                                alt=""
                                className="absolute h-[100.02%] left-[6.91%] max-w-none top-[-0.01%] w-[93.09%]"
                                src={imgImage1867}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bg-[#5d9bf9] h-[49.446px] left-[85px] overflow-hidden rounded-[37.975px] top-[163.05px] w-[49.444px]">
                          <div className="absolute bottom-[-48.74px] h-[103.833px] left-[-15.54px] w-[77.257px]">
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <img
                                alt=""
                                className="absolute h-[92.64%] left-0 max-w-none top-[7.4%] w-full"
                                src={imgImage1889}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bg-[#2a214c] h-[49.446px] left-[503.02px] overflow-hidden rounded-[37.975px] top-[133px] w-[49.444px]">
                          <div className="absolute h-[72.312px] left-[-7.42px] top-[-8.04px] w-[71.076px]">
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <img
                                alt=""
                                className="absolute h-full left-[-1.76%] max-w-none top-0 w-[101.76%]"
                                src={
                                  imgLinaBoAVeryRealisticPhotoOfABusinessManOf40YearsOld8463Adc808B04B12923A7119Dc2C3C291
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex gap-3 items-start relative shrink-0">
                        <button type="button" className="size-9 rounded-xl bg-secondary hover:bg-hover transition-colors flex items-center justify-center" aria-label="Like">
                          <Icon name="heart" size="sm" />
                        </button>
                        <button type="button" className="size-9 rounded-xl bg-secondary hover:bg-hover transition-colors flex items-center justify-center" aria-label="Comment">
                          <Icon name="message-text" size="sm" />
                        </button>
                      </div>
                      <div className="flex items-center relative shrink-0">
                        <button
                          type="button"
                          className="h-9 px-4 rounded-lg gap-2 flex items-center hover:bg-hover transition-colors"
                        >
                          {/* Avatar Group */}
                          <div className="flex items-center gap-2 flex-1">
                            <div className="pr-1">
                              <AvatarGroup
                                size="xxs"
                                spacing={-4}
                                aria-label="Users who liked"
                              >
                                <div className="rounded-full">
                                  <Avatar
                                    size="xxs"
                                    src={img}
                                    name="User 1"
                                  />
                                </div>
                                <div className="rounded-full">
                                  <Avatar
                                    size="xxs"
                                    src={img1}
                                    name="User 2"
                                  />
                                </div>
                                <div className="rounded-full">
                                  <Avatar
                                    size="xxs"
                                    src={img2}
                                    name="User 3"
                                  />
                                </div>
                              </AvatarGroup>
                            </div>

                            <Typography
                              component="span"
                              variant="label-md"
                              color="primary"
                            >
                              <span className="leading-5">1882 likes</span>
                            </Typography>
                          </div>
                        </button>
                        <button
                          type="button"
                          className="h-9 px-4 rounded-lg flex items-center hover:bg-hover transition-colors"
                        >
                          <Typography
                            component="span"
                            variant="label-md"
                            color="primary"
                          >
                            <span className="leading-5">156 comments</span>
                          </Typography>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="flex flex-col items-start relative shrink-0 w-[332px]">
            <div className=" flex flex-col items-start overflow-hidden rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] w-full">
              <div className="border border-primary flex flex-col gap-4 items-start justify-center px-6 py-5 rounded-2xl w-full">
                <div className="flex items-center relative shrink-0 w-full">
                  <Typography
                    component="span"
                    variant="label-md"
                    color="primary"
                  >
                    <span className="leading-5">Members</span>
                  </Typography>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="bg-[#506cf0] border border-white border-solid overflow-hidden relative rounded-full shrink-0 size-5">
                    <div className="absolute left-1/2 size-5 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <div className="absolute inset-0 rounded-[20px]">
                        <img
                          alt=""
                          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none rounded-[20px] size-full"
                          src={img}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    Samantha Green
                  </Typography>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="bg-[#506cf0] border border-white border-solid overflow-hidden relative rounded-full shrink-0 size-5">
                    <div className="absolute left-1/2 size-5 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <div className="absolute inset-0 rounded-[20px]">
                        <div className="absolute inset-0 pointer-events-none rounded-[20px]">
                          <div className="absolute bg-[#f6c3b5] inset-0 rounded-[20px]" />
                          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                            <img
                              alt=""
                              className="absolute h-[122.68%] left-[-7.57%] max-w-none top-0 w-[113.42%]"
                              src={img17}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    Ava Johnson
                  </Typography>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="bg-[#506cf0] border border-white border-solid overflow-hidden relative rounded-full shrink-0 size-5">
                    <div className="absolute left-1/2 size-5 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <div className="absolute inset-0 rounded-[20px]">
                        <div className="absolute inset-0 pointer-events-none rounded-[20px]">
                          <div className="absolute bg-[#a7d5e7] inset-0 rounded-[20px]" />
                          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                            <img
                              alt=""
                              className="absolute h-[205.71%] left-[-135.56%] max-w-none top-[-4.28%] w-[311.22%]"
                              src={img2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    Isabella Brown
                  </Typography>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="bg-[#506cf0] border border-white border-solid overflow-hidden relative rounded-full shrink-0 size-5">
                    <div className="absolute left-1/2 size-5 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <div className="absolute inset-0 rounded-[20px]">
                        <img
                          alt=""
                          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none rounded-[20px] size-full"
                          src={img18}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    Oliver Thompson
                  </Typography>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="bg-[#506cf0] border border-white border-solid overflow-hidden relative rounded-full shrink-0 size-5">
                    <div className="absolute left-1/2 size-5 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <div className="absolute inset-0 rounded-[20px]">
                        <div className="absolute inset-0 pointer-events-none rounded-[20px]">
                          <div className="absolute bg-[#d9cfbb] inset-0 rounded-[20px]" />
                          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                            <img
                              alt=""
                              className="absolute h-[246.57%] left-[-194.58%] max-w-none top-[-15.08%] w-[371.31%]"
                              src={img1}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    Liam Smith
                  </Typography>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="bg-[#506cf0] border border-white border-solid overflow-hidden relative rounded-full shrink-0 size-5">
                    <div className="absolute left-1/2 size-5 top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <div className="absolute inset-0 rounded-[20px]">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
                          <img
                            alt=""
                            className="absolute left-[-42.76%] max-w-none size-[192.5%] top-[-8.21%]"
                            src={img19}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    Noah Davis
                  </Typography>
                </div>
                <div className="flex items-center relative shrink-0 w-full">
                  <Typography
                    component="span"
                    variant="body-sm"
                    color="secondary"
                  >
                    See members
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
