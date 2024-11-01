const std = @import("std");

pub fn build(b: *std.Build) void {
	const target = b.standardTargetOptions(.{});
	const optimize = b.standardOptimizeOption(.{});
	const exe = b.addExecutable(.{
		.name = "API",
		.root_source_file = b.path("src/main.zig"),
		.target = target,
		.optimize = optimize,
	});
	const zap = b.dependency("zap", .{.target = target, .optimize = optimize, .openssl = false});
    exe.root_module.addImport("zap", zap.module("zap"));
	const curl = b.dependency("curl", .{ .link_vendor = false });
	exe.root_module.addImport("curl", curl.module("curl"));
	exe.linkSystemLibrary("curl");
	exe.linkLibC();
	b.installArtifact(exe);
	const run_cmd = b.addRunArtifact(exe);
	if (b.args) |args| {
		run_cmd.addArgs(args);
	}
	const run_step = b.step("run", "run the api");
	run_step.dependOn(&run_cmd.step);
}
