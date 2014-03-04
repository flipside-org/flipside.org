# Title: Jekyll PreventWidow
# Authors: Olaf Veerman - olaf@flipside.org
# Based on: http://textplain.blogspot.pt/2007/06/widontrb.html
#
# Description: Provides a Liquid Filter that prevents widows on texts by replacing the space between the last two words with a non-breaking space.
#
# Example: {{ post.title | widont }}
#
# Allows you to turn this:
# | You have to see it to believe |
# | it                            |
#
# into this:
# | You have to see it to         |
# | believe it                    |

require 'liquid'

module Jekyll
  module PreventWidow
    # Example:
    def widont(text)
      text.gsub(/([^\s])\s+([^\s]+)$/, '\1&nbsp;\2')
    end
  end
end

Liquid::Template.register_filter(Jekyll::PreventWidow)