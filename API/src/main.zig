const std = @import("std");
const curl = @import("curl");
const zap = @import("zap");

const urlh = "https://docs.google.com/spreadsheets/d/1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g/export?format=csv&id=1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g&gid=478852445";
const urla = "https://docs.google.com/spreadsheets/d/1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g/export?format=csv&id=1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g&gid=0";

var gpa: ?std.heap.GeneralPurposeAllocator(.{.thread_safe=true}) = null;
var easy: ?curl.Easy = null;
var hr: ?[]const u8 = null;
var ar: ?[]const u8 = null;
var ht : u64 = 0;
var at : u64 = 0;

fn download(comptime h: bool) void {
	const now: u64 = @intCast(std.time.timestamp());
	var url : [:0]const u8 = urla;
	if (h) { url = urlh; }
	if (easy.?.get(url)) |resp| {
		defer resp.deinit();
		std.debug.print("[i] status code: {d}\n", .{resp.status_code});
		const body = resp.body.?.items;
		const alloc = gpa.?.allocator();
		var b = alloc.alloc(u8, body.len) catch |e| { std.debug.print("[#] alloc error {}\n", .{e}); return; };
		std.mem.copyForwards(u8, b[0..body.len], body);
		if (h) {
			if (hr != null) { alloc.free(hr.?); }
			hr = b;
			ht = now;
		} else {
			if (ar != null) { alloc.free(ar.?); }
			ar = b;
			at = now;
		}
	} else |e| {
		std.debug.print("[#] fetch error {}\n", .{e});
	}
}

fn on_request(r: zap.Request) void {
	const now: u64 = @intCast(std.time.timestamp());
	r.setHeader("Content-Type", "text/html; charset=utf-8") catch |e| { std.debug.print("[#] response error {}\n", .{e}); };
	r.setHeader("Access-Control-Allow-Origin", "*") catch |e| { std.debug.print("[#] response error {}\n", .{e}); };
	if (r.path) |p| {
		if (std.mem.eql(u8, p, "/h")) {
			r.sendBody(hr.?) catch |e| { std.debug.print("[#] response error {}\n", .{e}); };
			if (ht + 1800 <= now) { download(true); }
			return;
		} else if (std.mem.eql(u8, p, "/a")) {
			r.sendBody(ar.?) catch |e| { std.debug.print("[#] response error {}\n", .{e}); };
			if (at + 1800 <= now) { download(false); }
			return;
		}
	}
	r.setStatus(.not_found);
	r.sendBody("404 Not found") catch {};
}

pub fn main() !void {
	gpa = std.heap.GeneralPurposeAllocator(.{.thread_safe = true}){};
	defer _ = gpa.?.deinit();
	const alloc = gpa.?.allocator();
	const ca_bundle = try curl.allocCABundle(alloc);
	defer ca_bundle.deinit();
	easy = try curl.Easy.init(alloc, .{.ca_bundle = ca_bundle});
	easy.?.setFollowLocation(true) catch {};
	defer easy.?.deinit();
	download(true);
	download(false);
	defer if (hr != null) { alloc.free(hr.?); };
	defer if (ar != null) { alloc.free(ar.?); };
	var listener = zap.HttpListener.init(.{.port = 8080, .on_request = on_request, .log = true});
	try listener.listen();
	std.debug.print("[i] listening on 0.0.0.0:8080\n", .{});
	zap.start(.{.threads = 2, .workers = 2});
}

