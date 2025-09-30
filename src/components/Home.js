import React, { useEffect, useState } from "react";


const Home = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [eventsPage, setEventsPage] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:3001/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        setEventsError(e.message || "Error fetching events");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const EVENTS_PAGE_SIZE = 3;
  const totalEventPages = Math.max(1, Math.ceil(events.length / EVENTS_PAGE_SIZE));
  const startIdx = eventsPage * EVENTS_PAGE_SIZE;
  const visibleEvents = events.slice(startIdx, startIdx + EVENTS_PAGE_SIZE);
  const canPrev = eventsPage > 0;
  const canNext = eventsPage < totalEventPages - 1;
  const goPrev = () => setEventsPage((p) => Math.max(0, p - 1));
  const goNext = () => setEventsPage((p) => Math.min(totalEventPages - 1, p + 1));
  return (

    <div
  
      className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-slate-50 font-sans"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
             {/* <Navbar/> */}
        {/* Headereeeee */}
        {/* <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7eef4] px-10 py-4 shadow-sm">
          <div className="flex items-center gap-3 text-[#0d151c]">
            <div className="size-6 text-[#0d8bf2]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#0d151c] text-xl font-bold leading-tight tracking-[-0.015em]">
              University Portal
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-6">
            <nav className="flex items-center gap-8">
              <a className="text-[#49779c] hover:text-[#0d8bf2] text-sm font-medium leading-normal transition-colors" href="#">Academics</a>
              <a className="text-[#49779c] hover:text-[#0d8bf2] text-sm font-medium leading-normal transition-colors" href="#">Admissions</a>
              <a className="text-[#49779c] hover:text-[#0d8bf2] text-sm font-medium leading-normal transition-colors" href="#">Research</a>
              <a className="text-[#49779c] hover:text-[#0d8bf2] text-sm font-medium leading-normal transition-colors" href="#">About Us</a>
              <a className="text-[#49779c] hover:text-[#0d8bf2] text-sm font-medium leading-normal transition-colors" href="#">News &amp; Events</a>
            </nav>
            <div className="flex gap-2">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-[#0d8bf2] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0b78d4] transition-colors">
                <span className="truncate">Apply Now</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-transparent text-[#0d151c] text-sm font-bold leading-normal tracking-[0.015em] border border-slate-300 hover:bg-slate-100 transition-colors">
                <span className="truncate">Student Login</span>
              </button>
            </div>
          </div>
        </header> */}
        <main className="flex-1">
          {/* Hero Section */}
          <section
            className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-white"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzCgPN7wGgKIPkAIgN4SV0Hm0le3MK9UWZOBS9kyjhLfRBySVGJnVFvIc9g0Qk1qexPLmjWzn3ORTXLWCOcdMZOpn0d2CE8NoIa0YPQvq-or4fRdnfSM_Qb1rh1ZVPr3_tDOG1K4taDrUzSk1_BKsE63o-fE6wZWTqySeOaNrPh7hkvFw7kliU5JMGnzOTWxyWmaTm_kM32EqF1Pd7t8eWzYqYMGs8cXKkNwt-hOqsLwphWWrK2i4OKnLgqwsHdPxL5DPqDfYc4b4")',
            }}
          >
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Welcome to MASTEC
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg font-light md:text-xl">
            
              </p>
              <button className="mt-8 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#0d8bf2] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0b78d4] transition-colors mx-auto">
                <span className="truncate">Explore Programs</span>
              </button>
            </div>
          </section>
          {/* Features */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#0d151c] mb-3">Academic Excellence</h2>
                  <p className="text-[#49779c]">
                    Renowned for our commitment to academic excellence, offering a wide range of programs to challenge and inspire.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d151c] mb-3">Vibrant Campus Life</h2>
                  <p className="text-[#49779c]">
                    Experience an inclusive community with countless opportunities for personal and academic growth.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d151c] mb-3">Student Success</h2>
                  <p className="text-[#49779c]">
                    Our supportive environment prepares students for leadership and success in their chosen fields.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Student Success Stories */}
          <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#0d151c] text-center mb-12">Students Achievements</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-4 rounded-lg overflow-hidden shadow-md bg-white">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJ0t8QTUlWOJSnTD0cfaTz15hJzaMPZlswDqtz4sPoLTYc3TKoe4EzY5yVjzFu1XcRkv1cGEGg3E2gIyOljf6mmtrqswl1CPaNKg-EB9FWHxx7IBJZnyfUJEY0-tUVqgM1_asG29blRP4oOeCKt4PckTGPPLbGh9nOihZ7USua9gwq9XfEd3Mee19Qf6lRedGyK_HAn2JFY0SJ9Zv0UtKLeXnu4DMae2Nsoqvh2jFNCREWLt20KZBx3HZ1o1k-b3xYxqS14bQSkbs")',
                    }}
                  ></div>
                  <div className="p-6">
                    <p className="text-[#0d151c] text-lg font-medium">Sarah Chen</p>
                    <p className="text-[#49779c] text-sm">Computer Science Graduate</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-lg overflow-hidden shadow-md bg-white">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJqBeAqzKF1VdLwxpFkJZ0oBY3PvMEzB9piiwMzCBWYSaaYKbpBnqBi_rjy4i3DC6fEIExLiAbc39dbQXb-KB42MusgpG7zTGY6FaVbhTWrv1BJmf6-4JhZG2BgpxIvHQNjHK82GxrZD8uMiQvN6TsKzibTE4CmptTk9Ac51rz5-G0h4R0t2Pv6DZJcdkQqMvpNSCPeeF8vx0ipgQ6Jgqj2d3nxEx-4D9liu6m1IJsAa3kIYa_tXd2Pa3gFSIvajFvriaSfZ8ruC8")',
                    }}
                  ></div>
                  <div className="p-6">
                    <p className="text-[#0d151c] text-lg font-medium">David Lee</p>
                    <p className="text-[#49779c] text-sm">Business Administration Alumnus</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-lg overflow-hidden shadow-md bg-white">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0p071ntUCuf0kbjuhNkIWzvfpqURfWWK9_mRgdpHZobCgMRzt4QXvV3-EmcdOgVL4Ritj0UHOkrt2CUCKA6HMb2ORLo_HB6QV9hKuVq6_vUG5GdONk1q0mAsuZSi16YwpxXyg6xoLBWukLrgFn9EhnFvj7oXZP5Z5zij8f4CmfnOEHX3gszRwMLgPjQpbllyjYTFO7f0XeLgPJoL9RFec6lOI8JZpP_qig4PXehp33ahj6hiyaVLEWxMGeVEXj9XnAW3kBx_oogY")',
                    }}
                  ></div>
                  <div className="p-6">
                    <p className="text-[#0d151c] text-lg font-medium">Maria Rodriguez</p>
                    <p className="text-[#49779c] text-sm">Engineering Innovator</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Announcements & Events */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-[#0d151c] mb-6">Announcements</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                      <div
                        className="flex-shrink-0 w-24 h-24 bg-cover bg-center rounded-md"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfQQOUldRyY5EBLmZBhoGoT2XdQaW2VcMqC7VoPQ2xzEmkBoBr-nEUQ759yQUDaChffMuk5Su_XcOVbqGFZ0HYtfdrGUNPmOdpA4RiFlf0aMz_1WdCpwZLn2rMXq1kSgZnd4p1h2SkW0MGGjRfob_zuScFiqyanDb94Bo3Yn0v-73Ca9kKgzjJ20IaND1oNmybZ3fo-31NfzTbuUhWZ_dktViJ5jMzVvhFxGqKm_z4JbkPygc17MFLwJRoWx1d9zLPkM4CnxvBUCk")',
                        }}
                      ></div>
                      <div>
                        <p className="text-[#0d151c] text-lg font-bold">New Scholarship Opportunities</p>
                        <p className="text-[#49779c] text-sm mt-1">
                          Explore our latest scholarship programs designed to support students from diverse backgrounds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0d151c] mb-6">Upcoming Events</h2>
                  <div className="space-y-6">
                    {loadingEvents && (
                      <div className="p-4 text-[#49779c]">Loading events...</div>
                    )}
                    {!loadingEvents && eventsError && (
                      <div className="p-4 text-red-600">{eventsError}</div>
                    )}
                    {!loadingEvents && !eventsError && events.length === 0 && (
                      <div className="p-4 text-[#49779c]">No upcoming events.</div>
                    )}
                    {!loadingEvents && !eventsError && visibleEvents.map((event) => (
                      <div key={event._id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-shrink-0 w-24 h-24 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center text-center px-2">
                          <div>
                            <div className="text-sm font-semibold">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-xs">{event.time || '-'}</div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[#0d151c] text-lg font-bold">{event.title}</p>
                          {event.description && (
                            <p className="text-[#49779c] text-sm mt-1">{event.description}</p>
                          )}
                          <p className="text-[#49779c] text-sm mt-1">{event.venue || '-'}</p>
                        </div>
                      </div>
                    ))}
                    {!loadingEvents && !eventsError && events.length > 0 && (
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={goPrev}
                          disabled={!canPrev}
                          className={`px-3 py-1.5 rounded border text-sm ${canPrev ? 'text-[#0d151c] border-slate-300 hover:bg-slate-100' : 'text-slate-400 border-slate-200 cursor-not-allowed'}`}
                        >
                          ← Previous
                        </button>
                        <div className="text-sm text-[#49779c]">
                          Page {eventsPage + 1} of {totalEventPages}
                        </div>
                        <button
                          onClick={goNext}
                          disabled={!canNext}
                          className={`px-3 py-1.5 rounded border text-sm ${canNext ? 'text-[#0d151c] border-slate-300 hover:bg-slate-100' : 'text-slate-400 border-slate-200 cursor-not-allowed'}`}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Photo Gallery */}
          <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#0d151c] text-center mb-12">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEtJOi10hwyk1dNlVkDmrWul11dxD-iDpIfFsuUDV2_w4Qz_ZwGOCkDYGqA4flKZemg3alrh_J-cEu_TVhNOUc4jErrCQHK-0PjzgcZUFiDNIZ8vzSxTTk2t4C0-eQ8YcSqJx-DKBvhFOFddiY34jh38JhcLGETRRwXaJynuDEhsvHsHdmNil9uHXFir-eAcowgfSdofEJZ_0BoB-eFs_M3viYywYB-87jI_LsUjIbvDL7XlcC_DiGgYBLFfT0FYz_jqvRvYb5D0A")',
                    }}
                  ></div>
                </div>
                <div className="overflow-hidden rounded-lg shadow-md">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALEik7OmwiS7qdLcVlQiXYmkX3eeKK854IG_KJ8qMyugdluTaHQAyDk5xV-ES9Xi7ab6xmRRa6QqGmfsBRWEJ6Z0m-xE7j2J66ZLFw-3k1wuBDdm8rYQtvTOqrTffPQTZPH5sjwO3Qgz8OZs1A2BrO-KWPaRFWvXpXAA28z4i0zTwhuNwXje3XCy1rtEhTd9-9cVHryqf2FlsKfUIlUJ1B2ypGpCk4OWSQbDy9shjBsfFft9n4P1AdySJFZheh2ukLTw8N7bUMxiw")',
                    }}
                  ></div>
                </div>
                <div className="overflow-hidden rounded-lg shadow-md">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBb806GVNJZjqKe06J66OORtmX3RflPapukmTg2XlkYRF-rfUFXUEg91c6RWayZPQWyUycOSPTG2k52E5dmsguAwdu7TeXMoiwzPH5u8lDoJPPwaAkpC5yTWSxHTJVTa-P3eDkMykQshP_ixALW8K01J8k82hkVEZYlrAib3__IIXLrwYPQs42N-qIUzgZeq4s4nqwOMjkFlDjwwddulOLlbSruJvPd7k4eV21g2EtVYiKK5O008K31q_KHaAkHH3TD98-PPK3cH7w")',
                    }}
                  ></div>
                </div>
                <div className="overflow-hidden rounded-lg shadow-md">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgokHde2D7LP6yHYHnklZ3CfFx_TDiUeahFJAq9CXX4zcQqZ-qR_lRyJyI-NlXUmirlvnaYdYsxn6YL4v1dPv-cmEN3G_BIO5p0zPudvn8EhLOGOxWE1C51NZsfhMSdm7sX1ItaWXBgk4Ln2ku1g6CLRBwZ-4B1BT6ZkK9xSfU916D3S7OJz1zVyrLjhlfhv3ViHS3fDafQSV0jvQWhSEkFMMY8042QY_sSHQmxO6ic7n4MX2epLJSWAfeuwa00EQPa0QHuRwnWos")',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
          {/* CTA */}
                    
        </main>
        {/* Footer */}
        <footer className="bg-[#0d151c] text-white">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <a className="text-slate-300 hover:text-white text-sm" href="#">Contact Us</a>
              <a className="text-slate-300 hover:text-white text-sm" href="#">Privacy Policy</a>
              <a className="text-slate-300 hover:text-white text-sm" href="#">Terms of Service</a>
            </div>
            <p className="mt-8 text-center text-slate-400 text-sm">
              © 2023 Mohandas Engineering College All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
